const ManagementController = require('../managementController');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');
const createTestCategory = require('../../../category/controller/__test__/categories.fixture');
const createTestProduct = require('../../../product/controller/__test__/products.fixture');

const brandServiceMock = {
  getById: jest.fn((id) => createTestBrand(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
};

const categoryServiceMock = {
  getById: jest.fn((id) => createTestCategory(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
};

const productServiceMock = {
  getById: jest.fn((id) => createTestProduct(id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
};

const controller = new ManagementController(
  brandServiceMock,
  categoryServiceMock,
  productServiceMock
);

const reqMock = {
  params: { id: 1 },
};

const resMock = {
  _status: null,
  _json: null,
  _error: null,
  status: function (code) {
    this._status = code;
    return this;
  },
  send: function (error) {
    this._error = error;
    return this;
  },
  json: function (json) {
    this._json = json;
    return this;
  },
};

describe('ManagementController methods', () => {
  afterEach(() => {
    Object.values(brandServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(categoryServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(productServiceMock).forEach((mockFn) => mockFn.mockClear());
    resMock._error = null;
    resMock._json = null;
    resMock._status = null;
  });

  test('allBrands fetchs and send all brands successfully', async () => {
    await controller.allBrands(reqMock, resMock);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allBrands send 500 error if service throws error ', async () => {
    brandServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allBrands(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });

  test('brand fetchs and send one brands successfully', async () => {
    await controller.brand(reqMock, resMock);
    const brand = brandServiceMock.getById(1);
    expect(brandServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(brand.id);
  });

  test('brand send 500 error if service throws error ', async () => {
    brandServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.brand(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });

  test('allCategories fetchs and send all brands successfully', async () => {
    await controller.allCategories(reqMock, resMock);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allCategories send 500 error if service throws error ', async () => {
    categoryServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allCategories(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });

  test('category fetchs and send one category successfully', async () => {
    await controller.category(reqMock, resMock);
    const category = categoryServiceMock.getById(1);
    expect(categoryServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(category.id);
  });

  test('category send 500 error if service throws error ', async () => {
    categoryServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.category(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });

  test('allProducts fetchs and send all brands successfully', async () => {
    await controller.allProducts(reqMock, resMock);
    expect(productServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock._status).toBe(200);
    expect(resMock._json.length).toBe(3);
  });

  test('allProducts send 500 error if service throws error ', async () => {
    productServiceMock.getAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.allProducts(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });

  test('product fetchs and send one product successfully', async () => {
    await controller.product(reqMock, resMock);
    const product = productServiceMock.getById(1);
    expect(productServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock._status).toBe(200);
    expect(resMock._json.id).toBe(product.id);
  });

  test('product send 500 error if service throws error ', async () => {
    productServiceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.product(reqMock, resMock);
    expect(resMock._status).toBe(500);
    expect(resMock._error).not.toBe(null);
  });
});
