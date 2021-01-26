const CategoryService = require('../categoryService');
const CategoryNotDefinedError = require('../../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const CategoriesIdsNotDefinedError = require('../../error/CategoriesIdsNotDefinedError');
const createTestCategory = require('../../controller/__test__/categories.fixture');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByIds: jest.fn(),
  delete: jest.fn(),
  viewProducts: jest.fn(),
};

const mockService = new CategoryService(repositoryMock);

describe('CategoryService methods', () => {
  test("save calls repository's save method without discounts", async () => {
    const category = createTestCategory(1);
    const discounts = undefined;
    await mockService.save(category);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(category, discounts);
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

  test("getByIds calls repository's getByIds method", async () => {
    const categoriesIdsMock = [1, 2, 3];
    await mockService.getByIds(categoriesIdsMock);

    expect(repositoryMock.getByIds).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(categoriesIdsMock);
  });

  test('getByIds throws error if param is not an array', async () => {
    await expect(mockService.getByIds('')).rejects.toThrowError(CategoriesIdsNotDefinedError);
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
