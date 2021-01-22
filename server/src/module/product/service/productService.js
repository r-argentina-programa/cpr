const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const Product = require('../entity/entity');

module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   */
  constructor(ProductRepository) {
    this.ProductRepository = ProductRepository;
  }

  /**
   * @param {Product} product
   */
  async save(product, categories, discounts) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.save(product, categories, discounts);
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
   * @param {Product} product
   */
  async delete(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.delete(product);
  }

  async getAll() {
    return this.ProductRepository.getAll();
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    return this.ProductRepository.getAllProductsSearch(term);
  }

  async getAllByCategoryAndBrand(categories, brands) {
    const data = await this.ProductRepository.getAllByCategoryAndBrand(categories, brands);
    const products = data.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    return products;
  }
};
