const { fromDataToEntity } = require('../mapper/brandMapper');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');

module.exports = class BrandController {
  constructor(brandService, uploadMiddleware) {
    this.ROUTE_BASE = '/admin/brand';
    this.BRAND_VIEW_DIR = 'brand/view';
    this.BrandService = brandService;
    this.uploadMiddleware = uploadMiddleware;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/`, this.brand.bind(this));
    app.get(`${ROUTE}/create`, this.createBrand.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.editBrand.bind(this));
    app.get(`${ROUTE}/product/:id`, this.viewProducts.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.deleteBrand.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('file'), this.saveBrand.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async brand(req, res) {
    const brands = await this.BrandService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.BRAND_VIEW_DIR}/index.njk`, { brands, messages, errors });
    req.session.errors = [];
    req.session.messages = [];
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
  async editBrand(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new BrandIdNotDefinedError();
    }

    try {
      const brand = await this.BrandService.getById(id);
      res.render(`${this.BRAND_VIEW_DIR}/form.njk`, { brand });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async saveBrand(req, res) {
    try {
      const brand = fromDataToEntity(req.body);
      if (req.file) {
        brand.logo = req.file.buffer.toString('base64');
      }
      const savedBrand = await this.BrandService.save(brand);
      if (brand.id) {
        req.session.messages = [
          `The brand with id ${savedBrand.id} was updated correctly (${savedBrand.name})`,
        ];
      } else {
        req.session.messages = [
          `The brand with id ${savedBrand.id} was created correctly (${savedBrand.name})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteBrand(req, res) {
    try {
      const { id } = req.params;
      const brand = await this.BrandService.getById(id);
      await this.BrandService.delete(brand);
      req.session.messages = [`The brand with ID: ${id} was removed (${brand.name})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  async viewProducts(req, res) {
    try {
      const { id } = req.params;
      const products = await this.BrandService.viewProducts(id);
      const brand = await this.BrandService.getById(id);
      res.render(`${this.BRAND_VIEW_DIR}/view.njk`, {
        products,
        brand,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }
};
