module.exports = class ProductController {
  constructor(ProductService, UploadMiddleware) {
    this.ProductService = ProductService;
    this.UploadMiddleware = UploadMiddleware;
  }
};
