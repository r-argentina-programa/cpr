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

  async save(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.save(product);
  }

  async getById(id) {
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    return this.ProductRepository.getById(id);
  }

  async delete(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.delete(product);
  }

  async getAll() {
    return this.ProductRepository.getAll();
  }
};
