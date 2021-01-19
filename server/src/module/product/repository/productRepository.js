const { Op } = require('sequelize');
const { fromModelToEntity } = require('../mapper/mapper');
const Product = require('../entity/entity');
const CategoryModel = require('../../category/model/categoryModel');

module.exports = class ProductRepository {
  /**
   * @param  {import("../model/productModel")} productModel
   */
  constructor(productModel) {
    this.productModel = productModel;
  }

  async save(product, categories = []) {
    if (!(product instanceof Product)) {
      throw new Error('Product not Defined');
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

    return fromModelToEntity(productModel);
  }

  async getById(id) {
    if (!id) {
      throw new Error('Id not defined');
    }
    const productInstance = await this.productModel.findByPk(id, {
      include: {
        model: CategoryModel,
        as: 'categories',
      },
    });
    if (!productInstance) {
      throw new Error(`Product with ID ${id} was not found`);
    }
    return fromModelToEntity(productInstance);
  }

  async delete(product) {
    if (!product) {
      throw new Error('Product Not Found');
    }
    return this.productModel.destroy({ where: { id: product.id } });
  }

  async getAll() {
    const productsInstance = await this.productModel.findAll({
      include: {
        model: CategoryModel,
        as: 'categories',
      },
    });
    return productsInstance.map((product) => fromModelToEntity(product));
  }

  async getAllProductsSearch(term) {
    const products = await this.productModel.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${term}%` } }],
      },
    });
    return products;
  }
};
