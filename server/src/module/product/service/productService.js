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
};
