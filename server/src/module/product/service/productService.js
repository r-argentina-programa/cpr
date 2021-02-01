/* eslint-disable class-methods-use-this */
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const Product = require('../entity/Product');
const { calculatePrice } = require('../../management/utils/calculatePrice');

module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   */
  constructor(ProductRepository, CategoryService, DiscountService) {
    this.ProductRepository = ProductRepository;
    this.CategoryService = CategoryService;
    this.DiscountService = DiscountService;
  }

  /**
   * @param {Product} product
   */
  async save(product, categoriesIds, discountsIds) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }

    await this.validateCategoriesDiscounts(product, categoriesIds);
    await this.validateProductsDiscounts(product, discountsIds);

    return this.ProductRepository.save(product, categoriesIds, discountsIds);
  }

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
    const products = await this.ProductRepository.getAllProductsSearch(term);
    return products.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  }

  async getAllByCategoryAndBrand(categories, brands, price, page, search) {
    const data = await this.ProductRepository.getAllByCategoryAndBrand(
      categories,
      brands,
      price,
      page,
      search
    );
    return data;
  }

  async getNumberOfProducts(categories, brands, price, search) {
    const data = await this.ProductRepository.getNumberOfProducts(
      categories,
      brands,
      price,
      search
    );
    return data;
  }
};
