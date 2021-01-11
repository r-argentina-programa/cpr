module.exports = class ProductController {
  constructor(ProductService, UploadMiddleware) {
    this.ProductService = ProductService;
    this.UploadMiddleware = UploadMiddleware;
  }

  configureRoutes(app) {
    const ROUTE = '/product';
    app.get(`${ROUTE}`, this.test.bind(this));
  }

  test(req, res) {
    console.log('Testing Funct when called');
  }
};
