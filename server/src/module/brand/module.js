const BrandController = require('./controller/brandController');
const BrandService = require('./service/brandService');
const BrandRepository = require('./repository/brandRepository');
const BrandModel = require('./model/brandModel');

/**
 * @param  {import("rsdi").IDIContainer} container
 * @param  {import("express").Application} app
 */
function initBrandModule(app, container) {
  /**
   * @type {import("./controller/brandController")} 'brandController'
   */
  const controller = container.get('BrandController');
  controller.configureRoutes(app);
}

module.exports = {
  BrandController,
  BrandService,
  BrandRepository,
  BrandModel,
  initBrandModule,
};
