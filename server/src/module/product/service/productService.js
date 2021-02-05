/* eslint-disable class-methods-use-this */
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const Product = require('../entity/Product');
const { calculatePrice } = require('../../management/utils/calculatePrice');

module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   * @param  {import("../../category/service/categoryService")} CategoryService
   * @param  {import("../../discount/service/discountService")} DiscountService
   */
  constructor(ProductRepository, CategoryService, DiscountService) {
    this.ProductRepository = ProductRepository;
    this.CategoryService = CategoryService;
    this.DiscountService = DiscountService;
  }

  /**
   * @param {Product} product
   * @param {Array} categoriesIds
   * @param {Array} discountsIds
   */
  async save(product, categoriesIds, discountsIds) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }

    await this.validateCategoriesDiscounts(product, categoriesIds);
    await this.validateProductsDiscounts(product, discountsIds);

    return this.ProductRepository.save(product, categoriesIds, discountsIds);
  }

  /**
   * @param {Product} product
   * @param {Array} categoriesIds
   */
  async validateCategoriesDiscounts(product, categoriesIds) {
    const categories = await this.CategoryService.getByIds(categoriesIds);
    categories.forEach((category) => {
      category.discounts.forEach((discount) => {
        const price = calculatePrice(discount, product.defaultPrice);
        if (price.finalPrice <= 0) {
          throw new Error(
            `The product cannot be saved because when the discount of categories is applied its final price is ${price.finalPrice}`
          );
        }
      });
    });
  }

  /**
   * @param {Product} product
   * @param {Array} discountsIds
   */
  async validateProductsDiscounts(product, discountsIds) {
    const discounts = await this.DiscountService.getByIds(discountsIds);
    discounts.forEach((discount) => {
      const price = calculatePrice(discount, product.defaultPrice);
      if (price.finalPrice <= 0) {
        throw new Error(
          `The product cannot be saved because when the discount is applied its final price is ${price.finalPrice}`
        );
      }
    });
  }

  /**
   * @param {number} id
   */
  async getById(id) {
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    return this.ProductRepository.getById(id);
  }

  /**
   * @param {Array} productIds
   */
  async getByIds(productIds) {
    if (!Array.isArray(productIds)) {
      throw new ProductIdNotDefinedError();
    }
    return this.ProductRepository.getByIds(productIds);
  }

  /**
   * @param {Product} product
   */
  async delete(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.delete(product);
  }

  /**
   * @param {number} offset
   * @param {number} limit
   */
  async getAll(offset, limit) {
    return this.ProductRepository.getAll(offset, limit);
  }

  async getAllCount() {
    return this.ProductRepository.getAllCount();
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    const products = (await this.ProductRepository.getAllProductsSearch(term)) || [];
    return products.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  }

  /**
   * @param {(string|string[])} category
   * @param {(string|string[])} brand
   * @param {Array} price
   * @param {number} page
   * @param {string} search
   */
  async getFilteredProducts(category, brand, price, page, search) {
    let categories = category;
    let brands = brand;
    if (typeof categories === 'string') {
      categories = [categories];
    }
    if (typeof brands === 'string') {
      brands = [brands];
    }
    const data = await this.ProductRepository.getFilteredProducts(
      categories,
      brands,
      price,
      page,
      search
    );
    return data;
  }

  /**
   * @param {(string|string[])} category
   * @param {(string|string[])} brand
   * @param {Array} price
   * @param {number} page
   * @param {string} search
   */
  async getNumberOfProducts(category, brand, price, search) {
    let categories = category;
    let brands = brand;
    if (typeof categories === 'string') {
      categories = [categories];
    }
    if (typeof brands === 'string') {
      brands = [brands];
    }
    const data = await this.ProductRepository.getNumberOfProducts(
      categories,
      brands,
      price,
      search
    );
    return data;
  }

  /**
   * @param {(string|string[])} category
   */
  async getRelatedProducts(category) {
    let categories = category;
    if (typeof categories === 'string') {
      categories = [categories];
    }
    const data = await this.ProductRepository.getRelatedProducts(categories);
    return data;
  }
};
