const { fromDataToEntity } = require('../mapper/categoryMapper');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');

module.exports = class CategoryController {
  /**
   * @param  {import("../service/categoryService")} categoryService
   */
  constructor(categoryService) {
    this.categoryService = categoryService;
    this.CATEGORY_VIEWS = 'category/views';
    this.ROUTE_BASE = '/admin/category';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:categoryId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:categoryId`, this.edit.bind(this));
    app.get(`${ROUTE}/create`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.get(`${ROUTE}/delete/:categoryId`, this.delete.bind(this));
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
  async view(req, res, next) {
    try {
      const { categoryId } = req.params;
      if (!Number(categoryId)) {
        throw new CategoryIdNotDefinedError();
      }

      const category = await this.categoryService.getById(categoryId);
      res.render(`${this.CATEGORY_VIEWS}/view.njk`, {
        category,
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    const { categoryId } = req.params;
    if (!Number(categoryId)) {
      throw new CategoryIdNotDefinedError();
    }

    try {
      const category = await this.categoryService.getById(categoryId);
      res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
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
  add(req, res) {
    res.render(`${this.CATEGORY_VIEWS}/form.njk`, {
      title: 'Add New Category',
    });
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    try {
      const categoryData = fromDataToEntity(req.body);
      const savedCategory = await this.categoryService.save(categoryData);

      if (categoryData.id) {
        req.session.messages = [
          `The brand with id ${savedCategory.id} was updated correctly (${savedCategory.name})`,
        ];
      } else {
        req.session.messages = [
          `The brand with id ${savedCategory.id} was created correctly (${savedCategory.name})`,
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
    try {
      const { categoryId } = req.params;
      const category = await this.categoryService.getById(categoryId);
      await this.categoryService.delete(category);
      req.session.messages = [`The brand with ID: ${categoryId} was removed (${category.name})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }
};
