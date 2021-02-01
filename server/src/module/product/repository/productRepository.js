const { Op } = require('sequelize');
const { fromModelToEntity } = require('../mapper/productMapper');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotFoundError = require('../error/ProductNotFoundError');
const Product = require('../entity/Product');

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
   * @param {Array} categoriesIds
   * @param {Array} discountsIds
   */
  async save(product, categoriesIds = [], discountsIds = []) {
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

    categoriesIds.map(async (id) => {
      await productModel.addCategory(id);
    });

    if (!buildOptions.isNewRecord) {
      const currentDiscounts = await productModel.getDiscounts();
      const discountsId = currentDiscounts.map((discount) => discount.id);
      await productModel.removeDiscount(discountsId);
    }

    discountsIds.map(async (id) => {
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
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
      ],
    });

    if (!productInstance) {
      throw new ProductNotFoundError(`There is not existing product with ID ${id}`);
    }

    if (Array.isArray(productInstance.categories)) {
      productInstance.categories.forEach((category) => {
        productInstance.discounts.push(...category.discounts);
      });
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

  async getAll(offset = 0, limit = 20) {
    const productsInstance = await this.productModel.findAll({
      include: [
        {
          model: this.brandModel,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
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
      offset,
      limit,
    });

    return productsInstance.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      const brandDiscounts = product.Brand.discounts;
      if (Array.isArray(brandDiscounts)) {
        product.discounts.push(...brandDiscounts);
      }
      return fromModelToEntity(product);
    });
  }

  async getAllCount() {
    return this.productModel.count();
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    const matchingNameProducts = await this.productModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${term}%` } },
          { description: { [Op.iLike]: `%${term}%` } },
        ],
      },
    });
    const matchingBrandNameProducts = await this.productModel.findAll({
      include: [
        {
          model: this.brandModel,
          where: {
            name: { [Op.iLike]: `%${term}%` },
          },
        },
      ],
    });
    const matchingCategoryNameProducts = await this.productModel.findAll({
      include: [
        {
          model: this.categoryModel,
          as: 'categories',
          where: {
            name: { [Op.iLike]: `%${term}%` },
          },
        },
      ],
    });
    matchingNameProducts.push(...matchingBrandNameProducts);
    matchingNameProducts.push(...matchingCategoryNameProducts);
    return matchingNameProducts;
  }

  async getAllByCategoryAndBrand(
    categories = [],
    brands = [],
    price = [0, 999999],
    page = 0,
    search
  ) {
    const limit = 12;
    let conditions;
    let categoriesConditions;
    let brandsConditions;
    if (search !== '0') {
      conditions = {
        name: { [Op.iLike]: `%${search}%` },
      };
    }
    if (brands[0] !== '0') {
      brandsConditions = {
        name: {
          [Op.like]: { [Op.any]: brands },
        },
      };
    }
    if (categories[0] !== '0') {
      categoriesConditions = {
        name: {
          [Op.like]: { [Op.any]: categories },
        },
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
          where: brandsConditions,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
      ],
      limit,
      offset: (page - 1) * limit,
    });

    const productsEntities = products.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      const brandDiscounts = product.Brand.discounts;
      if (Array.isArray(brandDiscounts)) {
        product.discounts.push(...brandDiscounts);
      }
      return fromModelToEntity(product);
    });

    return productsEntities.filter((product) => {
      const { discount } = product;
      if (price[1] === 'Infinity') {
        price[1] = 99999999999;
      }
      if (discount) {
        return discount.finalPrice >= price[0] && discount.finalPrice <= Number(price[1]);
      }
      return product.defaultPrice >= price[0] && product.defaultPrice <= Number(price[1]);
    });
  }

  async getNumberOfProducts(categories, brands, price = [0, Infinity], search) {
    let conditions;
    let categoriesConditions;
    let brandsConditions;
    if (search) {
      conditions = {
        name: { [Op.iLike]: `%${search}%` },
      };
    }
    if (brands) {
      brandsConditions = {
        name: {
          [Op.like]: { [Op.any]: brands },
        },
      };
    }
    if (categories) {
      categoriesConditions = {
        name: {
          [Op.like]: { [Op.any]: categories },
        },
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
          where: brandsConditions,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
      ],
    });

    const productsEntities = products.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      const brandDiscounts = product.Brand.discounts;
      if (Array.isArray(brandDiscounts)) {
        product.discounts.push(...brandDiscounts);
      }
      return fromModelToEntity(product);
    });

    const numberOfProducts = productsEntities.filter((product) => {
      const { discount } = product;
      const minPrice = Number(price[0]);
      const maxPrice = Number(price[1]);
      if (discount) {
        const priceWithDiscount = Number(discount.finalPrice);
        return priceWithDiscount >= minPrice && priceWithDiscount <= maxPrice;
      }
      const defaultPrice = Number(product.defaultPrice);
      return defaultPrice >= minPrice && defaultPrice <= maxPrice;
    }).length;
    return numberOfProducts;
  }

  /**
   * @param {Array} productIds
   */
  async getByIds(productIds) {
    if (!Array.isArray(productIds)) {
      throw new ProductIdNotDefinedError();
    }

    const productsInstance = await this.productModel.findAll({
      where: {
        id: productIds,
      },
      include: [
        {
          model: this.brandModel,
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
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
      const brandDiscounts = product.Brand.discounts;
      if (Array.isArray(brandDiscounts)) {
        product.discounts.push(...brandDiscounts);
      }
      return fromModelToEntity(product);
    });
  }
};
