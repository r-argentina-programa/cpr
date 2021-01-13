const { fromDataToEntity: fromBrandDataToEntity } = require('../../brand/mapper/brandMapper');

module.exports = class ManagementController {
  constructor(brandService, productService, categoryService, uploadMiddleware) {
    this.ROUTE_BASE = '/admin';
    this.BRAND_VIEW_DIR = 'brand/view';
    this.CATEGORY_VIEW_DIR = 'category/view';
    this.PRODUCT_VIEW_DIR = 'product/view';
    this.BrandService = brandService;
    this.categoryService = categoryService;
    this.ProductService = productService;
    this.uploadMiddleware = uploadMiddleware;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/brand`, this.brand.bind(this));
    //app.get(`${ROUTE}/category`, this.category.bind(this));
    //app.get(`${ROUTE}/product`, this.product.bind(this));
    app.get(`${ROUTE}/brand/create`, this.createBrand.bind(this));
    app.post(`${ROUTE}/brand/save`, this.uploadMiddleware.single('file'), this.saveBrand.bind(this));
    //app.get(`${ROUTE}/category/create`, this.createCategory.bind(this));
    //app.get(`${ROUTE}/product/create`, this.createProduct.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async brand(req, res) {
    const brands = await this.BrandService.getAll();
    console.log(brands)
    res.render(`${this.BRAND_VIEW_DIR}/index.njk`, { brands });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createBrand(req, res) {
    res.render(`${this.BRAND_VIEW_DIR}/form.njk`);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async saveBrand(req, res) {
    const { filename } = req.file;
    const { name } = req.body;

    const brandImageURL = `${process.env.APP_URL}/files/${filename}`;
    try {
      const brandData = fromBrandDataToEntity({
        name,
        logo: brandImageURL,
      });
      const newBrand = await this.BrandService.save(brandData);
      res.send('SE CARGO LA MARCA');
    } catch (error) {
      console.log(error);
    }
  }
};
