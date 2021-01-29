const CategoryController = require('../categoryController');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const createTestCategory = require('./categories.fixture');
const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');

const serviceMock = {
  save: jest.fn((category) => createTestCategory(category.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
  getById: jest.fn((id) => createTestCategory(id)),
  delete: jest.fn(),
};

const discountServiceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestDiscount(id + 1))),
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

const mockController = new CategoryController(serviceMock, discountServiceMock);

describe('CategoryController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(discountServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
    nextMock.mockClear();
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

  test('index renders index.njk with a list of categories', async () => {
    const categoriesList = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    const { errors, messages } = reqMock.session;
    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('category/view/index.njk', {
      categoriesList,
      errors,
      messages,
    });
  });

  test('view renders view.njk with one category', async () => {
    await mockController.view(reqMock, resMock, nextMock);
    const category = serviceMock.getById(1);

    const { errors } = reqMock.session;
    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('category/view/view.njk', {
      category,
    });
    expect(errors).toHaveLength(0);
  });

  test('view throws error because id is not defined', async () => {
    const reqMockWithoutId = Object.assign({}, reqMock, { params: { id: undefined } });
    await mockController.view(reqMockWithoutId, resMock, nextMock);
    const { errors } = reqMock.session;

    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(resMock.redirect).toHaveBeenCalled();
    expect(errors).not.toHaveLength(0);
  });

  test('view set errors and redirects because category is not found', async () => {
    serviceMock.getById.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.view(reqMock, resMock, nextMock);
    const { errors } = reqMock.session;

    expect(resMock.render).toHaveBeenCalledTimes(0);
    expect(resMock.redirect).toHaveBeenCalled();
    expect(errors).not.toHaveLength(0);
  });

  test('edit renders a form to edit a category', async () => {
    const category = serviceMock.getById(1);
    const discounts = discountServiceMock.getAll();
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(discountServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('category/view/form.njk', {
      category,
      discounts,
    });
    expect(reqMock.session.errors.length).toBe(0);
  });

  test('edit throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutProductId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutProductId, resMock)).rejects.toThrowError(
      CategoryIdNotDefinedError
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

  test('create renders form to add a new category', async () => {
    await mockController.create(reqMock, resMock);
    const discounts = discountServiceMock.getAll();
    const { categories } = reqMock.session;
    expect(discountServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('category/view/form.njk', {
      discounts,
      category: { discounts: [] },
      categories,
    });
  });

  test('save, saves a new category, without discounts', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
        name: 'electronics',
        discounts: '',
      },
      session: {
        errors: [],
        messages: [],
      },
    };

    const discounts = [];
    const productMock = createTestCategory(0);
    productMock.discounts = undefined;

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(productMock, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save, updates a category, without discounts', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        name: 'electronics',
        discounts: '',
      },
      session: {
        errors: [],
        messages: [],
      },
    };
    const discounts = [];
    const productMock = createTestCategory(1);
    productMock.discounts = undefined;

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(productMock, discounts);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save set errors if body is not defined', async () => {
    const reqSaveMock = {
      session: {
        errors: [],
        messages: [],
      },
    };
    serviceMock.save.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.save(reqSaveMock, resMock);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).not.toHaveLength(0);
  });

  test('save set errors if service save throw error', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        name: 'electronics',
      },
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

  test('deletes an existing category', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors.length).toBe(0);
    expect(reqMock.session.messages.length).not.toBe(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutProductId = {
      params: {},
      session: {
        errors: [],
        messages: [],
      },
    };

    await expect(mockController.delete(reqMockWithoutProductId, resMock)).rejects.toThrowError(
      CategoryIdNotDefinedError
    );
  });

  test('deletes should load error if service throws error', async () => {
    serviceMock.delete.mockImplementationOnce(() => {
      throw new Error();
    });
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors.length).not.toBe(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });
});
