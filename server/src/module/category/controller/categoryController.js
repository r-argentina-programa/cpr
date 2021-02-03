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
    app.get(`${ROUTE}/view/:id`, this.auth.bind(this), this.view.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.create.bind(this));
    app.post(`${ROUTE}/save`, this.auth.bind(this), this.save.bind(this));
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
        pages: Math.ceil((await this.categoryService.getAllCount()) / limit),
      };
      const offset = limit * (pageData.selected - 1);
      const categoriesList = await this.categoryService.getAll(offset, limit);
      const { errors, messages } = req.session;

      if (categoriesList.length !== 0 || pageData.selected === 1) {
        res.render(`${this.CATEGORY_VIEWS}/index.njk`, {
          categoriesList,
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
    const { id, categories } = req.params;
    if (!Number(id)) {
      throw new CategoryIdNotDefinedError();
    }

    try {
      const category = await this.categoryService.getById(id);
      const discounts = await this.discountService.getAll();

      res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
        category,
        discounts,
        categories,
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
      const { categories } = req.session;
      const discounts = await this.discountService.getAll();
      if (discounts.length > 0) {
        res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
          discounts,
          category: { discounts: [] },
          categories,
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
      if (e.message === 'llave duplicada viola restricción de unicidad «categories_name_key»') {
        req.session.errors = ['That category is already registered'];
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

  async search(req, res) {
    try {
      const { term } = req.params;
      const { errors, messages } = req.session;
      const categoriesList = await this.categoryService.getAllCategoriesSearch(term);
      res.render(`${this.CATEGORY_VIEWS}/search.njk`, {
        categoriesList,
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
