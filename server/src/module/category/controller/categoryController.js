const { fromDataToEntity } = require('../mapper/categoryMapper');

module.exports = class CategoryController {
  /**
   * @param  {import("../service/categoryService")} categoryService
   */
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = '/category';
    app.get(`${ROUTE}`, this.save.bind(this));
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
};
