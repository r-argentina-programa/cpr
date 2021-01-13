module.exports = class ManagementController {
  constructor(BrandService) {
    this.BrandService = BrandService;
  }

  configureRoutes(app) {
    const ROUTE = '/brand';
    app.get(`${ROUTE}`, this.test.bind(this));
  }

  test(req, res) {
    console.log('Testing management module when called');
  }
};
