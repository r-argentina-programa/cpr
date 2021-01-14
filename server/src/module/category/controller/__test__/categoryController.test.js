const CategoryController = require('../categoryController');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const createTestCategory = require('./categories.fixture');

const serviceMock = {
  save: jest.fn((category) => createTestCategory(category.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCategory(id + 1))),
  getById: jest.fn((id) => createTestCategory(id)),
  delete: jest.fn(),
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

const mockController = new CategoryController(serviceMock);

describe('CategoryController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
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

  test('edit renders a form to edit a category', async () => {
    const category = serviceMock.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('category/view/form.njk', {
      category,
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
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('category/view/form.njk');
  });

  test('saves a category with a image', async () => {
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

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestCategory(1));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors.length).toBe(0);
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
