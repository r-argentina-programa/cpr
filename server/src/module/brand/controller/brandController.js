const { fromDataToEntity } = require('../mapper/brandMapper');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');

module.exports = class BrandController {
  constructor(brandService, discountService, uploadMiddleware) {
    this.ADMIN_ROUTE = '/admin';
    this.ROUTE_BASE = '/admin/brand';
    this.BRAND_VIEW_DIR = 'brand/view';
    this.BrandService = brandService;
    this.discountService = discountService;
    this.uploadMiddleware = uploadMiddleware;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/`, this.auth.bind(this), this.brand.bind(this));
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.createBrand.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.editBrand.bind(this));
    app.get(`${ROUTE}/product/:id`, this.auth.bind(this), this.viewProducts.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.deleteBrand.bind(this));
    app.post(
      `${ROUTE}/save`,
      this.auth.bind(this),
      this.uploadMiddleware.single('file'),
      this.saveBrand.bind(this)
    );
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async auth(req, res, next) {
    if (req.session.username === process.env.ADMIN_USERNAME && req.session.admin) {
      return next();
    }
    req.session.errors = ['You can only see this after you have logged in'];
    res.redirect(`${this.ADMIN_ROUTE}`);
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
    try {
      const discounts = await this.discountService.getAll();
      if (discounts.length > 0) {
        res.render(`${this.BRAND_VIEW_DIR}/form.njk`, {
          discounts,
        });
      } else {
        throw new Error('To create a brand you must first create a discount');
      }
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async editBrand(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new BrandIdNotDefinedError();
    }

    try {
      const brand = await this.BrandService.getById(id);
      const discounts = await this.discountService.getAll();

      res.render(`${this.BRAND_VIEW_DIR}/form.njk`, {
        brand,
        discounts,
      });
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
      const brandData = fromDataToEntity(req.body);

      let discountsIds = [];
      if (req.body.discounts) {
        discountsIds = JSON.parse(req.body.discounts).map((e) => e.id);
      }

      if (req.file) {
        brandData.logo = req.file.buffer.toString('base64');
      }
      const savedBrand = await this.BrandService.save(brandData, discountsIds);

      if (brandData.id) {
        req.session.messages = [
          `The brand ${savedBrand.name} was updated correctly (ID: ${savedBrand.id})`,
        ];
      } else {
        req.session.messages = [
          `The brand ${savedBrand.name} was created correctly (ID: ${savedBrand.id})`,
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
      req.session.messages = [`The brand ${brand.name} was removed (ID: ${id})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
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
