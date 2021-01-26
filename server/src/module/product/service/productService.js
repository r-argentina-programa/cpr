/* eslint-disable class-methods-use-this */
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const Product = require('../entity/Product');
const { calculatePrice } = require('../../management/utils/calculatePrice');

module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} productRepository
   * @param  {import("../../category/service/categoryService")} categoryService
   * @param  {import("../../discount/service/discountService")} discountService
   */
  constructor(productRepository, categoryService, discountService) {
    this.productRepository = productRepository;
    this.categoryService = categoryService;
    this.discountService = discountService;
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

    return this.productRepository.save(product, categoriesIds, discountsIds);
  }

  /**
   * @param {Product} product
   * @param {Array} categoriesIds
   */
  async validateCategoriesDiscounts(product, categoriesIds) {
    const categories = await this.categoryService.getByIds(categoriesIds);
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
    const discounts = await this.discountService.getByIds(discountsIds);
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
    return this.productRepository.getById(id);
  }

  /**
   * @param {Product} product
   */
  async delete(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.productRepository.delete(product);
  }

  async getAll() {
    return this.productRepository.getAll();
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    return this.productRepository.getAllProductsSearch(term);
  }

  /**
   * @param {Array} categoriesIds
   * @param {Array} brandsIds
   */
  async getAllByCategoryAndBrand(categoriesIds, brandsIds) {
    const data = await this.productRepository.getAllByCategoryAndBrand(categoriesIds, brandsIds);
    const products = data.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    return products;
  }
};
