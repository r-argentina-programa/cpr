const DiscountController = require('../discountController');
const DiscountIdNotDefinedError = require('../../error/DiscountIdNotDefinedError');
const createTestDiscount = require('./discount.fixture');

const serviceMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestDiscount(id + 1))),
  save: jest.fn((discount) => createTestDiscount(discount.id)),
  getById: jest.fn((id) => createTestDiscount(id)),
  delete: jest.fn(),
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

const mockController = new DiscountController(serviceMock);

const nextMock = jest.fn();

describe('DiscountController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
    reqMock.session.errors = [];
    reqMock.session.messages = [];
    nextMock.mockClear();
  });

  test('configure routes', () => {
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

  test('index renders index.njk with a list of discounts', async () => {
    const discountsList = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    const { errors, messages } = reqMock.session;
    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('discount/view/index.njk', {
      discountsList,
      errors,
      messages,
    });
  });

  test('edit renders a form to edit a discount', async () => {
    const discount = serviceMock.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('discount/view/form.njk', {
      discount,
    });
    expect(reqMock.session.errors.length).toBe(0);
  });

  test('edit throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutDiscountId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutDiscountId, resMock)).rejects.toThrowError(
      DiscountIdNotDefinedError
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

  test('view renders view.njk with one discount', async () => {
    await mockController.view(reqMock, resMock, nextMock);
    const discount = serviceMock.getById(1);

    const { errors } = reqMock.session;
    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('discount/view/view.njk', {
      discount,
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

  test('create renders a form to add a new discount', async () => {
    await mockController.create(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('discount/view/form.njk');
  });

  test('save, saves a new discount', async () => {
    const reqSaveMock = {
      body: {
        id: 0,
        type: 'fixed',
        value: '50',
      },
      session: {
        errors: [],
        messages: [],
      },
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestDiscount(0));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(reqSaveMock.session.errors).toHaveLength(0);
  });

  test('save, updates a discount', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        type: 'fixed',
        value: '50',
      },
      session: {
        errors: [],
        messages: [],
      },
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestDiscount(1));
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
        type: 'fixed',
        value: '50',
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

  test('deletes an existing discount', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(reqMock.session.errors.length).toBe(0);
    expect(reqMock.session.messages.length).not.toBe(0);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes throws an error if id is not passed as parameter', async () => {
    const reqMockWithoutDiscountId = {
      params: {},
      session: {
        errors: [],
        messages: [],
      },
    };

    await expect(mockController.delete(reqMockWithoutDiscountId, resMock)).rejects.toThrowError(
      DiscountIdNotDefinedError
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
