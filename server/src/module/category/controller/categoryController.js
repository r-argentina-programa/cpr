const { fromDataToEntity } = require('../mapper/categoryMapper');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');

module.exports = class CategoryController {
  /**
   * @param  {import("../service/categoryService")} categoryService
   */
  constructor(categoryService, discountService) {
    this.ADMIN_ROUTE = '/admin';
    this.categoryService = categoryService;
    this.discountService = discountService;
    this.CATEGORY_VIEWS = 'category/view';
    this.ROUTE_BASE = '/admin/category';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.auth.bind(this), this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.auth.bind(this), this.view.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.create.bind(this));
    app.post(`${ROUTE}/save`, this.auth.bind(this), this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.delete.bind(this));
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
    const categoriesList = await this.categoryService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.CATEGORY_VIEWS}/index.njk`, {
      categoriesList,
      messages,
      errors,
    });
    req.session.errors = [];
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res) {
    try {
      const { id } = req.params;
      if (!Number(id)) {
        throw new CategoryIdNotDefinedError();
      }

      const category = await this.categoryService.getById(id);
      res.render(`${this.CATEGORY_VIEWS}/view.njk`, {
        category,
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
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new CategoryIdNotDefinedError();
    }

    try {
      const category = await this.categoryService.getById(id);
      const discounts = await this.discountService.getAll();

      res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
        category,
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
  async create(req, res) {
    try {
      const discounts = await this.discountService.getAll();
      if (discounts.length > 0) {
        res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
          discounts,
        });
      } else {
        throw new Error('To create a category you must first create a discount');
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
      const categoryData = fromDataToEntity(req.body);

      let discountsIds = [];
      if (req.body.discounts) {
        discountsIds = JSON.parse(req.body.discounts).map((e) => e.id);
      }

      const savedCategory = await this.categoryService.save(categoryData, discountsIds);

      if (categoryData.id) {
        req.session.messages = [
          `The category ${savedCategory.name} was updated correctly (ID: ${savedCategory.id})`,
        ];
      } else {
        req.session.messages = [
          `The category ${savedCategory.name} was created correctly (ID: ${savedCategory.id})`,
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
  async delete(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new CategoryIdNotDefinedError();
    }
    try {
      const category = await this.categoryService.getById(id);
      await this.categoryService.delete(category);
      req.session.messages = [`The Category with ID: ${id} was removed (${category.name})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }
};
