const { fromDataToEntity } = require('../mapper/brandMapper');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');

module.exports = class BrandController {
  /**
   * @param {import("../../brand/service/brandService")} brandService
   * @param {import("../service/productService")} discountService
   */
  constructor(brandService, discountService, uploadMiddleware) {
    this.ADMIN_ROUTE = '/admin';
    this.ROUTE_BASE = '/admin/brand';
    this.BRAND_VIEW_DIR = 'brand/view';
    this.brandService = brandService;
    this.discountService = discountService;
    this.uploadMiddleware = uploadMiddleware;
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.post(
      `${ROUTE}/save`,
      this.auth.bind(this),
      this.uploadMiddleware.single('file'),
      this.save.bind(this)
    );
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.create.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/product/:id`, this.auth.bind(this), this.viewProducts.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.delete.bind(this));
    app.get(`${ROUTE}/:page?`, this.auth.bind(this), this.index.bind(this));
    app.get(`${ROUTE}/search/:term`, this.auth.bind(this), this.search.bind(this));
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
  async index(req, res) {
    try {
      const limit = 10;
      const pageData = {
        selected: req.params.page ? Number(req.params.page) : 1,
        pages: Math.ceil((await this.brandService.getAllCount()) / limit),
      };
      const offset = limit * (pageData.selected - 1);
      const brands = await this.brandService.getAll(offset, limit);
      const { errors, messages } = req.session;

      if (brands.length !== 0 || pageData.selected === 1) {
        res.render(`${this.BRAND_VIEW_DIR}/index.njk`, { brands, messages, errors, pageData });
        req.session.errors = [];
        req.session.messages = [];
      } else {
        throw new Error('That page was not found');
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
  async create(req, res) {
    try {
      const discounts = await this.discountService.getAll();
      const { brands } = req.session;

      res.render(`${this.BRAND_VIEW_DIR}/form.njk`, {
        discounts,
        brand: { discounts: [] },
        brands,
      });
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new BrandIdNotDefinedError();
    }

    try {
      const brand = await this.brandService.getById(id);
      const discounts = await this.discountService.getAll();
      const { brands } = req.session;

      res.render(`${this.BRAND_VIEW_DIR}/form.njk`, {
        brand,
        discounts,
        brands,
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
  async save(req, res) {
    try {
      const brandData = fromDataToEntity(req.body);

      let discountsIds = [];
      if (req.body.discounts) {
        discountsIds = JSON.parse(req.body.discounts).map((e) => e.id);
      }

      if (req.file) {
        brandData.logo = req.file.buffer.toString('base64');
      }
      const savedBrand = await this.brandService.save(brandData, discountsIds);

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
      if (e.message === 'llave duplicada viola restricción de unicidad «brands_name_key»') {
        req.session.errors = ['That brand is already registered'];
      } else {
        req.session.errors = [e.message, e.stack];
      }
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const brand = await this.brandService.getById(id);
      await this.brandService.delete(brand);
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
      const products = await this.brandService.viewProducts(id);
      const brand = await this.brandService.getById(id);
      res.render(`${this.BRAND_VIEW_DIR}/view.njk`, {
        products,
        brand,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  async search(req, res) {
    try {
      const { term } = req.params;
      const { errors, messages } = req.session;
      const brands = await this.brandService.getAllBrandsSearch(term);
      res.render(`${this.BRAND_VIEW_DIR}/search.njk`, {
        brands,
        messages,
        errors,
        term,
      });
      req.session.errors = [];
      req.session.messages = [];
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect(this.ROUTE_BASE);
    }
  }
};
