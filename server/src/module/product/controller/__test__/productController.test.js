const ProductController = require('../productController');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const createTestProduct = require('./products.fixture');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');
const createTestCategory = require('../../../category/controller/__test__/categories.fixture');
const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');

const serviceMock = {
  save: jest.fn((product) => createTestProduct(product.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestProduct(id + 1))),
  getById: jest.fn((id) => createTestProduct(id)),
  delete: jest.fn(),
  getAllProductsSearch: jest.fn((term) => {
    if (term === 'coca-cola') {
      return [createTestProduct()];
    }
    return [];
  }),
  getAllCount: jest.fn(() => 1),
};

const brandServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
};

const categoryServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
};

const discountServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestDiscount(id + 1))),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { id: 1, page: 1 },
  session: {
    errors: [],
    messages: [],
    username: process.env.ADMIN_USERNAME,
    admin: true,
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
  discountServiceMock,
  uploadMock
);

const nextMock = jest.fn();

describe('ProductController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(brandServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(categoryServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(discountServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
    reqMock.session.errors = [];
    reqMock.session.messages = [];
    nextMock.mockClear();
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

  test('Auth calls next because session username matches with admin username', () => {
    mockController.auth(reqMock, resMock, nextMock);
    expect(nextMock).toHaveBeenCalled();
    expect(reqMock.session.errors).toHaveLength(0);
  });

  test('Auth sets session errors and redirects because session username doesnt match with admin username', () => {
    reqMock.session.username = 'customer';
    mockController.auth(reqMock, resMock, nextMock);
    expect(nextMock).not.toHaveBeenCalled();
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalled();
  });

  test('index renders index.njk with a list of products', async () => {
    const productsList = serviceMock.getAll();
    await mockController.index(reqMock, resMock);
    const limit = 10;
    const pageData = {
      selected: reqMock.params.page ? Number(reqMock.params.page) : 1,
      pages: Math.ceil(serviceMock.getAllCount() / limit),
    };

    const { errors, messages } = reqMock.session;
    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(serviceMock.getAllCount).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/index.njk', {
      productsList,
      errors,
      messages,
      pageData,
    });
  });

  test('edit renders a form to edit a product', async () => {
    const product = serviceMock.getById(1);
    const brands = brandServiceMock.getAll();
    const categories = categoryServiceMock.getAll();
    const discounts = discountServiceMock.getAll();
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(2);

    expect(resMock.render).toHaveBeenCalledWith('product/view/form.njk', {
      product,
      brands,
      categories,
      discounts,
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
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('create renders a form to add a new product', async () => {
    await mockController.create(reqMock, resMock);
    const brands = brandServiceMock.getAll();
    const categories = categoryServiceMock.getAll();
    const discounts = discountServiceMock.getAll();
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(2);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/form.njk', {
      brands,
      categories,
      discounts,
      product: { categories: [], discounts: [] },
    });
  });

  test('create throws error because there are no brands created', async () => {
    brandServiceMock.getAll.mockImplementationOnce(() => []);
    await mockController.create(reqMock, resMock);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalled();
  });

  test('create throws error because there are no categories created', async () => {
    categoryServiceMock.getAll.mockImplementationOnce(() => []);
    await mockController.create(reqMock, resMock);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalled();
  });

  test('create throws error because there are no categories and brands created', async () => {
    categoryServiceMock.getAll.mockImplementationOnce(() => []);
    brandServiceMock.getAll.mockImplementationOnce(() => []);
    await mockController.create(reqMock, resMock);
    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(brandServiceMock.getAll).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalled();
  });

  test('save, saves a new Product with a image without categories and discounts', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
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

    const categories = [];
    const discounts = [];

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(0), categories, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save, saves a new Product with a image and categories, without discounts', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
        name: 'coca-cola',
        defaultPrice: '300',
        description: 'product description',
        brand_fk: '3',
        categories: '[{"id":1,"value":"Bebida"},{"id":2,"value":"Hogar"}]',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    const categories = [1, 2];
    const discounts = [];

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(0), categories, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save, updates a Product with a image without categories and discounts', async () => {
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

    const categories = [];
    const discounts = [];

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(1), categories, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save, set errors because save was not successful', async () => {
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

    const categories = [];
    const discounts = [];
    serviceMock.save.mockImplementationOnce(() => {
      throw new Error();
    });

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestProduct(1), categories, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).not.toHaveLength(0);
  });

  test('deletes an existing Product', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).toHaveLength(0);
    expect(reqMock.session.messages).not.toHaveLength(0);
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

  test('deletes sets error because product was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes sets error because delete was not successful', async () => {
    serviceMock.delete.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('search product by existing name', async () => {
    const searchTerm = 'coca-cola';
    const productMock = createTestProduct();
    const reqSearchMock = {
      params: { term: searchTerm },
      session: {
        errors: [],
        messages: [],
      },
    };

    await serviceMock.save(productMock);
    await mockController.search(reqSearchMock, resMock);
    expect(serviceMock.getAllProductsSearch).toHaveBeenCalledTimes(1);
    expect(serviceMock.getAllProductsSearch).toHaveBeenCalledWith(searchTerm);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/search.njk', {
      productsList: [productMock],
      messages: [],
      errors: [],
      term: searchTerm,
    });
  });

  test('search product by non-existent name', async () => {
    const searchTerm = 'sprite';
    const productMock = createTestProduct();
    const reqSearchMock = {
      params: { term: searchTerm },
      session: {
        errors: [],
        messages: [],
      },
    };
    await serviceMock.save(productMock);
    await mockController.search(reqSearchMock, resMock);
    expect(serviceMock.getAllProductsSearch).toHaveBeenCalledTimes(1);
    expect(serviceMock.getAllProductsSearch).toHaveBeenCalledWith(searchTerm);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('product/view/search.njk', {
      productsList: [],
      messages: [],
      errors: [],
      term: searchTerm,
    });
  });
});
