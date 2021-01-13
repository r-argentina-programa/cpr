const CategoryController = require('./controller/categoryController');
const CategoryService = require('./service/categoryService');
const CategoryRepository = require('./repository/categoryRepository');
const CategoryModel = require('./model/categoryModel');

/**
 * @param  {import("rsdi").IDIContainer} container
 * @param  {import("express").Application} app
 */
function initCategoryModule(app, container) {
  /**
   * @type {CategoryController")} 'controller'
   */
  const controller = container.get('CategoryController');
  controller.configureRoutes(app);
}

module.exports = {
  CategoryController,
  CategoryService,
  CategoryRepository,
  CategoryModel,
  initCategoryModule,
};
