module.exports = class ManagementController {
  constructor(brandService, productService) {
    this.ROUTE_BASE = '/admin';
    this.BRAND_VIEW_DIR = 'brand/view';
    this.CATEGORY_VIEW_DIR = 'category/view';
    this.PRODUCT_VIEW_DIR = 'product/view';
    this.brandService = brandService;
    //this.categoryService = categoryService;
    this.productService = productService;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/brand`, this.brand.bind(this));
    /* app.get(`${ROUTE}/category`, this.category.bind(this));
    app.get(`${ROUTE}/product`, this.product.bind(this));
    app.get(`${ROUTE}/brand/create`, this.createBrand.bind(this));
    app.get(`${ROUTE}/category/create`, this.createCategory.bind(this));
    app.get(`${ROUTE}/product/create`, this.createProduct.bind(this)); */
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async brand(req, res) {
    const brands = await this.brandService.getAll();
    res.render(`${this.BRAND_VIEW_DIR}/index.njk`, {
      data: { brands },
    });
  }
};
