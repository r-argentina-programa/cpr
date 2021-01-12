const ManagementController = require('./controller/managementController');

/**
 * @param  {import("rsdi").IDIContainer} container
 * @param  {import("express").Application} app
 */
function initManagementModule(app, container) {
  /**
   * @type {import("./controller/managementController")} 'managementController'
   */
  const controller = container.get('ManagementController');
  controller.configureRoutes(app);
}

module.exports = {
  ManagementController,
  initManagementModule,
};
