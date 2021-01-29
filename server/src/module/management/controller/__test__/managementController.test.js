/* eslint-disable no-underscore-dangle */
const ManagementController = require('../managementController');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');
const createTestCategory = require('../../../category/controller/__test__/categories.fixture');
const createTestProduct = require('../../../product/controller/__test__/products.fixture');

const brandServiceMock = {
  getById: jest.fn((id) => createTestBrand(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
  viewProducts: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
};

const categoryServiceMock = {
  getById: jest.fn((id) => createTestCategory(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
  viewProducts: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
};

const productServiceMock = {
  getById: jest.fn((id) => createTestProduct(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
  getAllProductsSearch: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
};

const controller = new ManagementController(
  brandServiceMock,
  categoryServiceMock,
  productServiceMock
);

const reqMock = {
  body: {
    password: 'password',
    username: 'admin',
  },
  params: { id: 1, term: 'example search' },
  password: 'password',
  session: {},
  username: 'admin',
};

const resMock = {
  _status: null,
  _json: null,
  _error: null,
  status(code) {
    this._status = code;
    return this;
  },
  send(error) {
    this._error = error;
    return this;
  },
  json(json) {
    this._json = json;
    return this;
  },
  redirect: jest.fn(),
  render: jest.fn(),
};

describe('ManagementController methods', () => {
  afterEach(() => {
    Object.values(brandServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(categoryServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(productServiceMock).forEach((mockFn) => mockFn.mockClear());
    resMock._error = null;
    resMock._json = null;
    resMock._status = null;
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'password';
  });

  test('configureRoutes configures specific routes', () => {
    const appMock = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const ROUTE = '/api';
    const ADMIN_ROUTE = '/admin';

    controller.configureRoutes(appMock);

    expect(appMock.post).toHaveBeenCalledTimes(1);
    expect(appMock.post).toHaveBeenCalledWith(`${ADMIN_ROUTE}/login`, expect.any(Function));
    expect(appMock.get).toHaveBeenCalledTimes(13);
    expect(appMock.get).toHaveBeenNthCalledWith(1, `${ADMIN_ROUTE}`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(2, `${ADMIN_ROUTE}/logout`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(3, `${ROUTE}/brands/all`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(4, `${ROUTE}/brand/:id`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(5, `${ROUTE}/categories/all`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(6, `${ROUTE}/category/:id`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(
      7,
      `${ROUTE}/products/all/:offset?/:limit?`,
      expect.any(Function)
    );
    expect(appMock.get).toHaveBeenNthCalledWith(8, `${ROUTE}/product/:id`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(9, `${ROUTE}/search/:term`, expect.any(Function));
    expect(appMock.get).toHaveBeenNthCalledWith(
      10,
      `${ROUTE}/brand/:id/viewProducts`,
      expect.any(Function)
    );
    expect(appMock.get).toHaveBeenNthCalledWith(
      11,
      `${ROUTE}/category/:id/viewProducts`,
      expect.any(Function)
    );
    expect(appMock.get).toHaveBeenNthCalledWith(
      12,
      `${ROUTE}/products/all/:brands/:categories/:price/:page/:search`,
      expect.any(Function)
    );
    expect(appMock.get).toHaveBeenNthCalledWith(
      13,
      `${ROUTE}/getCartPrice/:productsId/:productsAmount`,
      expect.any(Function)
    );
  });

  test('viewProductsByBrand fetches and sends the products by brand', async () => {
    await controller.viewProductsByBrand(reqMock, resMock);
    expect(brandServiceMock.viewProducts).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('viewProductsByBrand sends an error if service throws error', async () => {
    brandServiceMock.viewProducts.mockImplementationOnce(() => {
      throw new Error();
    });

    await controller.viewProductsByBrand(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('viewProductsByCategory fetches and sends the categories', async () => {
    await controller.viewProductsByCategory(reqMock, resMock);
    expect(categoryServiceMock.viewProducts).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('viewProductsByCategory sends an error if service throws error', async () => {
    categoryServiceMock.viewProducts.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.viewProductsByCategory(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('loginForm renders the login template', () => {
    controller.loginForm(reqMock, resMock);
    const messages = undefined;
    const errors = undefined;
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('management/view/login.njk', { messages, errors });
    expect(reqMock.session.errors.length).toBe(0);
    expect(reqMock.session.messages.length).toBe(0);
  });

  test('login shows error if credentials are incorrect', () => {
    reqMock.body.password = 'incorrectPassword';
    controller.login(reqMock, resMock);
    expect(reqMock.session.errors).toEqual(['Incorrect username and / or password']);
    expect(resMock.redirect).toHaveBeenCalledWith('/admin');
  });

  test('login logs the user if credentials are correct', () => {
    reqMock.body.password = 'password';
    controller.login(reqMock, resMock);
    expect(reqMock.session.admin).toBe(true);
    expect(reqMock.session.messages).toEqual([
      `Administrator "${process.env.ADMIN_USERNAME}" logged in successfully`,
    ]);
  });

  test('login throws error if there is one', () => {
    const reqMockWithErrors = {
      session: {},
      redirect: jest.fn(),
    };

    controller.login(reqMockWithErrors, resMock);
    expect(reqMockWithErrors.session.errors.length).toBe(2);
    expect(resMock.redirect).toHaveBeenCalledWith('/admin');
  });

  test('logout logs the user out and redirects to admin page', () => {
    controller.logout(reqMock, resMock);

    expect(resMock.redirect).toHaveBeenCalledWith('/admin');
    expect(reqMock.session.username).toEqual([]);
    expect(reqMock.session.admin).toEqual([]);
    expect(reqMock.session.messages).toEqual(['Administrator has been logged out']);
  });

  test('logout throws error if there is one', () => {
    const reqMockWithErrors = {
      body: { username: '', password: '' },
      session: {},
      redirect: jest.fn(),
    };
    controller.logout(reqMockWithErrors, resMock);
    expect(resMock.redirect).toHaveBeenCalledWith('/admin');
    expect(reqMockWithErrors.session.messages).toEqual([
      'You cannot log out because you have not logged in',
    ]);
  });

  test('search fetches and sends the corresponding products successfully', async () => {
    await controller.search(reqMock, resMock);

    expect(productServiceMock.getAllProductsSearch).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allBrands fetchs and send all brands successfully', async () => {
    await controller.allBrands(reqMock, resMock);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allBrands sends error if service throws error ', async () => {
    brandServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allBrands(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('brand fetchs and send one brands successfully', async () => {
    await controller.brand(reqMock, resMock);
    const brand = brandServiceMock.getById(1);
    expect(brandServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(brand.id);
  });

  test('brand sends error if service throws error ', async () => {
    brandServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.brand(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('allCategories fetchs and send all brands successfully', async () => {
    await controller.allCategories(reqMock, resMock);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allCategories sends error if service throws error ', async () => {
    categoryServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allCategories(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('category fetchs and send one category successfully', async () => {
    await controller.category(reqMock, resMock);
    const category = categoryServiceMock.getById(1);
    expect(categoryServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(category.id);
  });

  test('category sends error if service throws error ', async () => {
    categoryServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.category(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('allProducts fetchs and send all brands successfully', async () => {
    await controller.allProducts(reqMock, resMock);
    expect(productServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allProducts sends error if service throws error ', async () => {
    productServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allProducts(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });

  test('product fetchs and send one product successfully', async () => {
    await controller.product(reqMock, resMock);
    const product = productServiceMock.getById(1);
    expect(productServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(product.id);
  });

  test('product sends error if service throws error ', async () => {
    productServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.product(reqMock, resMock);
    expect(resMock._status).not.toBe(200);
    expect(resMock._error).not.toBe(null);
  });
});
