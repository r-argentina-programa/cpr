module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   */
  constructor(ProductRepository) {
    this.ProductRepository = ProductRepository;
  }

  async save(product) {
    if (!product) {
      throw new Error('Product Not Found');
    }
    return this.ProductRepository.save(product);
  }

  async getById(product) {
    if (!product) {
      throw new Error('Product Not Found');
    }
    return this.ProductRepository.getById(product);
  }

  async delete(product) {
    if (!product) {
      throw new Error('Product Not Found');
    }
    return this.ProductRepository.delete(product);
  }

  async getAll() {
    return this.ProductRepository.getAll();
  }
};
