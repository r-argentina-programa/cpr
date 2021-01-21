const BrandController = require('../brandController');
const BrandIdNotDefinedError = require('../../error/BrandIdNotDefinedError');
const createTestBrand = require('./brands.fixture');

const serviceMock = {
  save: jest.fn(() => createTestBrand(1)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestBrand(id + 1))),
  getById: jest.fn((id) => createTestBrand(id)),
  delete: jest.fn(),
  viewProducts: jest.fn(),
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

const mockController = new BrandController(serviceMock, uploadMock);

describe('BrandController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
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
    await mockController.brand(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    const { errors, messages } = reqMock.session;
    expect(resMock.render).toHaveBeenCalledWith('brand/view/index.njk', {
      brands,
      errors,
      messages,
    });
  });

  test('editBrand renders a form to edit a brand', async () => {
    const brand = serviceMock.getById(1);
    await mockController.editBrand(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('brand/view/form.njk', {
      brand,
    });
  });

  test('editBrand throws an error on undefined carId as argument', async () => {
    const reqMockWithoutBrandId = {
      params: {},
    };

    await expect(mockController.editBrand(reqMockWithoutBrandId, resMock)).rejects.toThrowError(
      BrandIdNotDefinedError
    );
  });

  test('editBrand sets errors and redirect because brand was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.editBrand(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(reqMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('createBrand renders a form to add a new brand', async () => {
    await mockController.createBrand(reqMock, resMock);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('brand/view/form.njk');
  });

  test('saveBrand, saves a new brand with an image', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
        name: 'coca-cola',
        logo: '/public/uploads/test.jpg',
      },
      file: { buffer: '/public/uploads/test.jpg' },
      session: {
        errors: [],
        messages: [],
      },
    };

    await mockController.saveBrand(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestBrand(0));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.messages).not.toHaveLength(0);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('saveBrand updates a brand with an image', async () => {
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

    await mockController.saveBrand(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestBrand(1));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.messages).not.toHaveLength(0);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('saveBrand set errors because save was not successful', async () => {
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
    await mockController.saveBrand(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestBrand(1));
    expect(reqSaveMock.session.errors).not.toHaveLength(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deleteBrand an existing brand', async () => {
    await mockController.deleteBrand(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.messages).not.toHaveLength(0);
    expect(reqMock.session.errors).toHaveLength(0);
  });

  test('deleteBrand set errors because brand was not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.deleteBrand(reqMock, resMock);
    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(serviceMock.delete).toHaveBeenCalledTimes(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors).not.toHaveLength(0);
  });

  test('deleteBrand set errors because delete was not successful', async () => {
    serviceMock.delete.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.deleteBrand(reqMock, resMock);
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
});
