const Discount = require('../../discount/entity/Discount');
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const { fromDataToEntity } = require('../mapper/mapper');

module.exports = class ProductController {
  /**
   * @param  {import("../service/productService")} ProductService
   */
  constructor(BrandService, CategoryService, ProductService, DiscountService, UploadMiddleware) {
    this.ADMIN_ROUTE = '/admin';
    this.ROUTE_BASE = '/admin/product';
    this.BrandService = BrandService;
    this.CategoryService = CategoryService;
    this.ProductService = ProductService;
    this.DiscountService = DiscountService;
    this.UploadMiddleware = UploadMiddleware;
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
      this.UploadMiddleware.single('file'),
      this.save.bind(this)
    );
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.delete.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/`, this.auth.bind(this), this.index.bind(this));
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.create.bind(this));
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
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async index(req, res) {
    const productsList = await this.ProductService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.PRODUCT_VIEWS}/index.njk`, {
      productsList,
      messages,
      errors,
    });
    req.session.errors = [];
    req.session.messages = [];
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
      console.log('Discounts en el controlador', discounts);

      const savedProduct = await this.ProductService.save(product, categories, discounts);

      if (product.id) {
        req.session.messages = [
          `The product with id ${savedProduct.id} was updated correctly (${savedProduct.name})`,
        ];
      } else {
        req.session.messages = [
          `The product with id ${savedProduct.id} was created correctly (${savedProduct.name})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
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
      const product = await this.ProductService.getById(id);
      // console.log('PRODUCTO', product);
      const brands = await this.BrandService.getAll();
      const categories = await this.CategoryService.getAll();
      const discounts = await this.DiscountService.getAll();

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
      const product = await this.ProductService.getById(id);
      await this.ProductService.delete(product);
      req.session.messages = [`The product with ID: ${id} was removed (${product.name})`];
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
      const brands = await this.BrandService.getAll();
      const categories = await this.CategoryService.getAll();
      const discounts = await this.DiscountService.getAll();
      // console.log('descuentos', discounts);
      if (brands.length > 0 && categories.length > 0) {
        res.render(`${this.PRODUCT_VIEWS}/form.njk`, {
          brands,
          categories,
          discounts,
          product: { categories: [] },
        });
      } else if (!brands.length > 0 && !categories.length > 0) {
        throw new Error('To create a product you must first create a brand and a category');
      } else {
        const error =
          brands.length > 0
            ? 'To create a product you must first create a category'
            : 'To create a product you must first create a brand';
        throw new Error(error);
      }
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect(this.ROUTE_BASE);
    }
  }
};
