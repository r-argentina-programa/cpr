const { fromDataToEntity } = require('../mapper/categoryMapper');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');

module.exports = class CategoryController {
  /**
   * @param  {import("../service/categoryService")} categoryService
   */
  constructor(categoryService) {
    this.categoryService = categoryService;
    this.CATEGORY_VIEWS = 'category/views';
    this.ROUTE_BASE = '/category';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:categoryId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:categoryId`, this.edit.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.post(`${ROUTE}/delete/:categoryId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const categories = await this.categoryService.getAll();
    res.render(`${this.CATEGORY_VIEWS}/index.njk`, {
      title: 'Category List',
      categories,
    });
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
        title: `Viewing ${category.name} `,
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

    const category = await this.categoryService.getById(categoryId);
    res.render(`${this.CATEGORY_VIEWS}/edit.njk`, {
      title: `Editing ${category.name}`,
      category,
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  add(req, res) {
    res.render(`${this.CATEGORY_VIEWS}/add.njk`, {
      title: 'Add New Category',
    });
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    const { name } = req.body;
    try {
      const categoryData = fromDataToEntity({
        name,
      });
      const newCategory = await this.categoryService.save(categoryData);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    const { categoryId } = req.params;
    const category = await this.categoryService.getById(categoryId);
    this.categoryService.delete(category);
    res.redirect(this.ROUTE_BASE);
  }
};
