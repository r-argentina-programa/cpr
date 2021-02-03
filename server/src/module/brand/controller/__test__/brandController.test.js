const BrandController = require('../brandController');
const BrandIdNotDefinedError = require('../../error/BrandIdNotDefinedError');
const createTestBrand = require('./brands.fixture');
const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');

const serviceMock = {
  save: jest.fn((brand) => createTestBrand(brand.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
  getById: jest.fn((id) => createTestBrand(id)),
  delete: jest.fn(),
  getAllCount: jest.fn(() => 1),
  viewProducts: jest.fn(),
  getAllBrandsSearch: jest.fn(() => createTestBrand()),
};

const discountServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestDiscount(id + 1))),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { id: 1 },
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

const nextMock = jest.fn();

const mockController = new BrandController(serviceMock, discountServiceMock, uploadMock);

describe('BrandController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
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

  test('brand renders index.njk with a list of brands', async () => {
    const brands = serviceMock.getAll();
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
    expect(resMock.render).toHaveBeenCalledWith('brand/view/index.njk', {
      brands,
      errors,
      messages,
      pageData,
    });
  });

  test('edit renders a form to edit a brand', async () => {
    const brand = serviceMock.getById(1);
    const discounts = discountServiceMock.getAll();
    await mockController.edit(reqMock, resMock);
    const { brands } = reqMock.session;

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(discountServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('brand/view/form.njk', {
      brand,
      discounts,
      brands,
    });
    expect(reqMock.session.errors.length).toBe(0);
  });

  test('edit throws an error on undefined carId as argument', async () => {
    const reqMockWithoutBrandId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutBrandId, resMock)).rejects.toThrowError(
      BrandIdNotDefinedError
    );
  });

  test('edit sets errors and redirect because brand was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('create renders a form to add a new brand', async () => {
    await mockController.create(reqMock, resMock);
    const discounts = discountServiceMock.getAll();
    const { brands } = reqMock.session;
    expect(discountServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('brand/view/form.njk', {
      discounts,
      brand: { discounts: [] },
      brands,
    });
  });

  test('save, saves a new brand with an image', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
        name: 'coca-cola',
        logo: '/public/uploads/test.jpg',
        discounts: '',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    const discounts = [];
    const brandMock = createTestBrand(0);
    brandMock.discounts = undefined;

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(brandMock, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.messages).not.toHaveLength(0);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save updates a brand with an image', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        name: 'coca-cola',
        logo: '/public/uploads/test.jpg',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    const discounts = [];
    const brandMock = createTestBrand(1);
    brandMock.discounts = undefined;

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(brandMock, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.messages).not.toHaveLength(0);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save set errors if service save throw error', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        name: 'coca-cola',
        logo: '/public/uploads/test.jpg',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    serviceMock.save.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).not.toHaveLength(0);
  });

  test('delete an existing brand', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.messages).not.toHaveLength(0);
    expect(reqMock.session.errors).toHaveLength(0);
  });

  test('delete set errors because brand was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.delete(reqMock, resMock);
    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledTimes(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
  });

  test('delete set errors because delete was not successful', async () => {
    serviceMock.delete.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.delete(reqMock, resMock);
    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
  });

  test('viewProducts renders view.njk with a list of products', async () => {
    const brand = serviceMock.getById(1);
    const products = serviceMock.viewProducts(1);
    await mockController.viewProducts(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(serviceMock.viewProducts).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('brand/view/view.njk', {
      products,
      brand,
    });
  });

  test('viewProducts set errors because products were not found', async () => {
    serviceMock.viewProducts.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.viewProducts(reqMock, resMock);
    expect(serviceMock.viewProducts).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
  });

  test('viewProducts set errors because brand was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.viewProducts(reqMock, resMock);
    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
  });

  test('search brand by existing name', async () => {
    const searchTerm = 'coca-cola';
    const brandMock = createTestBrand();
    const reqSearchMock = {
      params: { term: 'coca-cola' },
      session: {
        errors: [],
        messages: [],
      },
    };

    await serviceMock.save(brandMock);
    await mockController.search(reqSearchMock, resMock);
    expect(serviceMock.getAllBrandsSearch).toHaveBeenCalledTimes(1);
    expect(serviceMock.getAllBrandsSearch).toHaveBeenCalledWith(searchTerm);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('brand/view/search.njk', {
      brands: brandMock,
      messages: [],
      errors: [],
      term: searchTerm,
    });
  });
});
