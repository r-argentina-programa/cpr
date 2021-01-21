const DiscountController = require('./controller/discountController');
const DiscountService = require('./service/discountService');
const DiscountRepository = require('./repository/discountRepository');
const DiscountModel = require('./model/discountModel');
const DiscountTypeModel = require('./model/discountTypeModel');

/**
 * @param  {import("rsdi").IDIContainer} container
 * @param  {import("express").Application} app
 */
function initDiscountModule(app, container) {
  /**
   * @type {DiscountController")} 'controller'
   */
  const controller = container.get('DiscountController');
  controller.configureRoutes(app);
}

module.exports = {
  DiscountController,
  DiscountService,
  DiscountRepository,
  DiscountModel,
  DiscountTypeModel,
  initDiscountModule,
};
