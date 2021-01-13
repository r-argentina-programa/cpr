module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   */
  constructor(ProductRepository) {
    this.ProductRepository = ProductRepository;
  }

  async save(product) {
    return this.ProductRepository.save(product);
  }

  async getById(product) {
    return this.ProductRepository.getById(product);
  }

  async delete(product) {
    return this.ProductRepository.delete(product);
  }

  async getAll() {
    return this.ProductRepository.getAll();
  }
};
