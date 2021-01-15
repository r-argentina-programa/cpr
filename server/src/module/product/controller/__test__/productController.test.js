const ProductController = require('../productController');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const createTestProduct = require('./products.fixture');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');
const createTestCategory = require('../../../category/controller/__test__/categories.fixture');

const serviceMock = {
  save: jest.fn((product) => createTestProduct(product.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
  getById: jest.fn((id) => createTestProduct(id)),
  delete: jest.fn(),
};

const brandServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
};

const categoryServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { id: 1 },
  session: {
    errors: [],
    messages: [],
  },
};
const resMock = {
  render: jest.fn(),
  redirect: jest.fn(),
};

const mockController = new ProductController(
  brandServiceMock,
  categoryServiceMock,
  serviceMock,
  uploadMock
);

describe('ProductController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(brandServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
    reqMock.session.errors = [];
    reqMock.session.messages = [];
  });

  test('configures routes', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(uploadMock.single).toHaveBeenCalled();
  });

  test('index renders index.njk with a list of products', async () => {
    const productsList = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    const { errors, messages } = reqMock.session;
    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/index.njk', {
      productsList,
      errors,
      messages,
    });
  });

  test('edit renders a form to edit a product', async () => {
    const product = serviceMock.getById(1);
    const brands = brandServiceMock.getAll();
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(2);

    expect(resMock.render).toHaveBeenCalledWith('product/view/form.njk', {
      product,
      brands,
    });
    expect(reqMock.session.errors.length).toBe(0);
  });

  test('edit throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutProductId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutProductId, resMock)).rejects.toThrowError(
      ProductIdNotDefinedError
    );
  });

  test('edit loads errors and redirect if service throws error', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.edit(reqMock, resMock);
    expect(reqMock.session.errors.length).not.toBe(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('create renders a form to add a new product', async () => {
    await mockController.create(reqMock, resMock);
    const brands = brandServiceMock.getAll();
    const categories = categoryServiceMock.getAll();
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(2);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/form.njk', {
      brands,
      categories,
    });
  });

  test('saves a Product with a image', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        name: 'coca-cola',
        defaultPrice: '300',
        description: 'product description',
        brand_fk: '3',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(1));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors.length).toBe(0);
  });

  test('deletes an existing Product', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors.length).toBe(0);
    expect(reqMock.session.messages.length).not.toBe(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutProductId = {
      params: {},
    };

    await expect(mockController.delete(reqMockWithoutProductId, resMock)).rejects.toThrowError(
      ProductIdNotDefinedError
    );
  });
});
