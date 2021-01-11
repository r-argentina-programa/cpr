const ProductController = require('./controller/productController');
const ProductService = require('./service/productService');
const ProductRepository = require('./repository/productRepository');
const ProductModel = require('./model/productModel');

/**
 * @param  {import("rsdi").IDIContainer} container
 * @param  {import("express").Application} app
 */
function initProductModule(app, container) {
  /**
   * @type {import("./controller/productController")} 'ProductController'
   */
  const controller = container.get('ProductController');
  controller.configureRoutes(app);
}

module.exports = {
  ProductController,
  ProductService,
  ProductRepository,
  ProductModel,
  initProductModule,
};
