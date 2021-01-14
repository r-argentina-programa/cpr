const ProductController = require('../productController');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const createTestProduct = require('./products.fixture');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');

const serviceMock = {
  save: jest.fn(),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
  getById: jest.fn((id) => createTestProduct(id)),
  delete: jest.fn(),
};

const brandServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { id: 1 },
};
const resMock = {
  render: jest.fn(),
  redirect: jest.fn(),
};

const mockController = new ProductController(serviceMock, uploadMock, brandServiceMock);

describe('ProductController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(brandServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
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

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/index.njk', {
      productsList,
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
  });

  test('edit throws an error on undefined carId as argument', async () => {
    const reqMockWithoutProductId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutProductId, resMock)).rejects.toThrowError(
      ProductIdNotDefinedError
    );
  });

  test('create renders a form to add a new product', async () => {
    await mockController.create(reqMock, resMock);
    const brands = brandServiceMock.getAll();
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(2);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/form.njk', {
      brands,
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
      file: { path: '/public/uploads/test.jpg' },
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(1));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes an existing Product', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });
});
