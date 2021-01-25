const { Op } = require('sequelize');
const { fromModelToEntity } = require('../mapper/mapper');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotFoundError = require('../error/ProductNotFoundError');
const Product = require('../entity/entity');
const CategoryModel = require('../../category/model/categoryModel');

module.exports = class ProductRepository {
  /**
   * @param  {import("../model/productModel")} productModel
   * @param  {import("../../category/model/categoryModel")} categoryModel
   * @param  {import("../../brand/model/brandModel")} brandModel
   * @param  {import("../../discount/model/discountModel")} discountModel
   */
  constructor(productModel, categoryModel, brandModel, discountModel) {
    this.productModel = productModel;
    this.categoryModel = categoryModel;
    this.brandModel = brandModel;
    this.discountModel = discountModel;
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
        {
          model: this.categoryModel,
          as: 'categories',
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
        {
          model: this.discountModel,
          as: 'discounts',
        },
        {
          model: this.brandModel,
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
        { model: this.brandModel },
        {
          model: this.categoryModel,
          as: 'categories',
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
        {
          model: this.discountModel,
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

  async getAllByCategoryAndBrand(categories = [], brands = []) {
    const conditions = {};
    let categoriesConditions;
    if (brands[0] != '0') {
      conditions.brand_fk = brands;
    }
    if (categories[0] !== '0') {
      categoriesConditions = {
        id: categories,
      };
    }

    const products = await this.productModel.findAll({
      where: conditions,
      include: [
        {
          model: this.categoryModel,
          as: 'categories',
          where: categoriesConditions,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
        { model: this.discountModel, as: 'discounts' },
        {
          model: this.brandModel,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
      ],
    });

    return products.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      const brandDiscounts = product.Brand.discount;
      if (Array.isArray(brandDiscounts)) {
        product.discounts.push(...brandDiscounts);
      }
      return fromModelToEntity(product);
    });
  }
};
