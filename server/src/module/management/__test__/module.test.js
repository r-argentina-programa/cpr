const { initManagementModule } = require('../module');

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn(),
};

const container = {
  get: jest.fn(() => controller),
};

test('Managment module gets initialized correctly', () => {
  initManagementModule(app, container);

  expect(container.get).toHaveBeenCalledTimes(1);
  expect(container.get).toHaveBeenCalledWith('ManagementController');

  expect(controller.configureRoutes).toHaveBeenCalledTimes(1);
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
});
