const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const { fromDataToEntity } = require('../mapper/productMapper');

module.exports = class ProductController {
  /**
   * @param {import("../../brand/service/brandService")} brandService
   * @param {import("../service/productService")} categoryService
   * @param {import("../service/productService")} productService
   * @param {import("../service/productService")} discountService
   */
  constructor(brandService, categoryService, productService, discountService, uploadMiddleware) {
    this.ADMIN_ROUTE = '/admin';
    this.ROUTE_BASE = '/admin/product';
    this.brandService = brandService;
    this.categoryService = categoryService;
    this.productService = productService;
    this.discountService = discountService;
    this.uploadMiddleware = uploadMiddleware;
    this.PRODUCT_VIEWS = 'product/view';
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
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.delete.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/:page?`, this.auth.bind(this), this.index.bind(this));
    app.get(`${ROUTE}/search/:term`, this.auth.bind(this), this.search.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  // eslint-disable-next-line consistent-return
  async auth(req, res, next) {
    if (req.session.username === process.env.ADMIN_USERNAME && req.session.admin) {
      return next();
    }
    req.session.errors = ['You can only see this after you have logged in'];
    res.redirect(`${this.ADMIN_ROUTE}`);
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async index(req, res) {
    try {
      const limit = 10;
      const pageData = {
        selected: req.params.page ? Number(req.params.page) : 1,
        pages: Math.ceil((await this.productService.getAllCount()) / limit),
      };
      const offset = limit * (pageData.selected - 1);
      const productsList = await this.productService.getAll(offset, limit);
      const { errors, messages } = req.session;

      if (productsList.length !== 0 || pageData.selected === 1) {
        res.render(`${this.PRODUCT_VIEWS}/index.njk`, {
          productsList,
          messages,
          errors,
          pageData,
        });
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
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    try {
      const product = fromDataToEntity(req.body);
      let categories = [];
      if (req.body.categories) {
        categories = JSON.parse(req.body.categories).map((e) => e.id);
      }
      let discounts = [];
      if (req.body.discounts) {
        discounts = JSON.parse(req.body.discounts).map((e) => e.id);
      }
      if (req.file) {
        product.imageSrc = req.file.buffer.toString('base64');
      }

      const savedProduct = await this.productService.save(product, categories, discounts);

      if (product.id) {
        req.session.messages = [
          `The product ${savedProduct.name} was updated correctly (ID: ${savedProduct.id})`,
        ];
      } else {
        req.session.messages = [
          `The product ${savedProduct.name} was created correctly (ID: ${savedProduct.id})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    try {
      const product = await this.productService.getById(id);
      const brands = await this.brandService.getAll();
      const categories = await this.categoryService.getAll();
      const discounts = await this.discountService.getAll();

      res.render(`${this.PRODUCT_VIEWS}/form.njk`, {
        product,
        brands,
        categories,
        discounts,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async delete(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    try {
      const product = await this.productService.getById(id);
      await this.productService.delete(product);
      req.session.messages = [`The product ${product.name} was removed (ID: ${id})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async create(req, res) {
    try {
      const brands = await this.brandService.getAll();
      const categories = await this.categoryService.getAll();
      const discounts = await this.discountService.getAll();

      if (brands.length > 0 && categories.length > 0) {
        res.render(`${this.PRODUCT_VIEWS}/form.njk`, {
          brands,
          categories,
          discounts,
          product: { categories: [], discounts: [] },
        });
      } else {
        throw new Error('To create a product you must first create a brand, ans a category');
      }
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect(this.ROUTE_BASE);
    }
  }

  async search(req, res) {
    try {
      const { term } = req.params;
      const { errors, messages } = req.session;
      const productsList = await this.productService.getAllProductsSearch(term);
      res.render(`${this.PRODUCT_VIEWS}/search.njk`, {
        productsList,
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
