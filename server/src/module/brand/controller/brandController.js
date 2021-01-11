module.exports = class BrandController {
  constructor(BrandService) {
    this.BrandService = BrandService;
  }

  configureRoutes(app) {
    const ROUTE = '/brand';
    app.get(`${ROUTE}`, this.test.bind(this));
  }

  test(req, res) {
    console.log('Testing brand module when called');
  }
};
