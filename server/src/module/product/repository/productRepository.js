const { Op } = require('sequelize');
const { fromModelToEntity } = require('../mapper/mapper');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotFoundError = require('../error/ProductNotFoundError');
const Product = require('../entity/entity');
const BrandModel = require('../../brand/model/brandModel');
const CategoryModel = require('../../category/model/categoryModel');
const DiscountModel = require('../../discount/model/discountModel');

module.exports = class ProductRepository {
  /**
   * @param  {import("../model/productModel")} productModel
   */
  constructor(productModel) {
    this.productModel = productModel;
  }

  /**
   * @param {Product} product
   */
  async save(product, categories = [], discounts = []) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    let productModel;

    const buildOptions = {
      isNewRecord: !product.id,
    };

    productModel = this.productModel.build(product, buildOptions);
    productModel = await productModel.save();

    if (!buildOptions.isNewRecord) {
      const currentCategories = await productModel.getCategories();
      const categoriesId = currentCategories.map((category) => category.id);
      await productModel.removeCategory(categoriesId);
    }

    categories.map(async (id) => {
      await productModel.addCategory(id);
    });

    if (!buildOptions.isNewRecord) {
      const currentDiscounts = await productModel.getDiscounts();
      const discountsId = currentDiscounts.map((discount) => discount.id);
      await productModel.removeDiscount(discountsId);
    }
    console.log('Discounts en el repositorio', discounts);

    discounts.map(async (id) => {
      await productModel.addDiscount(id);
    });

    return fromModelToEntity(productModel);
  }

  /**
   * @param {number} id
   */
  async getById(id) {
    if (!id) {
      throw new ProductIdNotDefinedError();
    }
    const productInstance = await this.productModel.findByPk(id, {
      include: [
        { model: BrandModel, as: 'brand', paranoid: false },
        {
          model: CategoryModel,
          as: 'categories',
          include: {
            model: DiscountModel,
            as: 'discounts',
          },
        },
        {
          model: DiscountModel,
          as: 'discounts',
        },
      ],
    });

    if (Array.isArray(productInstance.categories)) {
      productInstance.categories.forEach((category) => {
        productInstance.discounts.push(...category.discounts);
      });
    }
    if (!productInstance) {
      throw new ProductNotFoundError(`There is not existing product with ID ${id}`);
    }
    return fromModelToEntity(productInstance);
  }

  /**
   * @param {Product} product
   */
  async delete(product) {
    if (!product) {
      throw new ProductNotFoundError();
    }
    return this.productModel.destroy({ where: { id: product.id } });
  }

  async getAll() {
    const productsInstance = await this.productModel.findAll({
      include: [
        {
          model: CategoryModel,
          as: 'categories',
          include: {
            model: DiscountModel,
            as: 'discounts',
          },
        },
        {
          model: DiscountModel,
          as: 'discounts',
        },
      ],
    });

    return productsInstance.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      return fromModelToEntity(product);
    });
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    const products = await this.productModel.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${term}%` } }],
      },
    });
    return products;
  }
};
