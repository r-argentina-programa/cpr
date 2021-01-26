const DiscountService = require('../discountService');
const DiscountNotDefinedError = require('../../error/DiscountNotDefinedError');
const DiscountIdNotDefinedError = require('../../error/DiscountIdNotDefinedError');
const DiscountsIdsNotDefinedError = require('../../error/DiscountsIdsNotDefinedError');
const createTestDiscount = require('../../controller/__test__/discount.fixture');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByIds: jest.fn(),
  delete: jest.fn(),
};

const mockService = new DiscountService(repositoryMock);

describe('discountService methods', () => {
  test("save calls repository's save method", async () => {
    const discount = createTestDiscount(1);
    await mockService.save(discount);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(discount);
  });

  test('save throws an error if param is not instance of Discount', async () => {
    await expect(mockService.save({})).rejects.toThrowError(DiscountNotDefinedError);
  });

  test("getAll calls repository's getAll method", async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test("getById calls repository's getById method", async () => {
    await mockService.getById(1);

    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('getById throws error if param is not a number', async () => {
    await expect(mockService.getById()).rejects.toThrowError(DiscountIdNotDefinedError);
  });

  test("getByIds calls repository's getByIds method", async () => {
    const discountIdsMock = [1, 2, 3];
    await mockService.getByIds(discountIdsMock);

    expect(repositoryMock.getByIds).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(discountIdsMock);
  });

  test('getByIds throws an error if the parameter is incorrect', async () => {
    const discountIdsMock = '';
    await expect(mockService.getByIds(discountIdsMock)).rejects.toThrowError(
      DiscountsIdsNotDefinedError
    );
  });

  test("delete calls repository's delete method", async () => {
    const discount = createTestDiscount(1);
    await mockService.delete(discount);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(discount);
  });

  test('delete throws an error if param is not instance of Discount', async () => {
    await expect(mockService.delete({})).rejects.toThrowError(DiscountNotDefinedError);
  });
});
