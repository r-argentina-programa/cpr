const CategoryService = require('../categoryService');
const CategoryNotDefinedError = require('../../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const createTestCategory = require('../../controller/__test__/categories.fixture');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  viewProducts: jest.fn(),
};

const mockService = new CategoryService(repositoryMock);

describe('CategoryService methods', () => {
  test("save calls repository's save method", async () => {
    const category = createTestCategory(1);
    await mockService.save(category);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(category);
  });

  test('save throws an error if param is not instance of Category', async () => {
    await expect(mockService.save({})).rejects.toThrowError(CategoryNotDefinedError);
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
    await expect(mockService.getById()).rejects.toThrowError(CategoryIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const category = createTestCategory(1);
    await mockService.delete(category);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(category);
  });

  test('delete throws an error if param is not instance of Brand', async () => {
    await expect(mockService.delete({})).rejects.toThrowError(CategoryNotDefinedError);
  });

  test('viewProducts calls repository viewProduct method', async () => {
    const id = 1;
    await mockService.viewProducts(id);

    expect(repositoryMock.viewProducts).toHaveBeenCalledTimes(1);
    expect(repositoryMock.viewProducts).toHaveBeenCalledWith(id);
  });
});
