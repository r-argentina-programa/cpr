const BrandService = require('../brandService');
const createTestBrand = require('../../controller/__test__/brands.fixture');
const BrandNotDefinedError = require('../../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../../error/BrandIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  viewProducts: jest.fn(),
};

const mockService = new BrandService(repositoryMock);

describe('BrandService methods', () => {
  test("save calls repository's save method", async () => {
    const brand = createTestBrand(1);
    await mockService.save(brand);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(brand);
  });

  test('save throws an error if param is not instance of Brand', async () => {
    await expect(mockService.save({})).rejects.toThrowError(BrandNotDefinedError);
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
    await expect(mockService.getById()).rejects.toThrowError(BrandIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const brand = createTestBrand(1);
    await mockService.delete(brand);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(brand);
  });

  test('delete throws an error if param is not instance of Brand', async () => {
    await expect(mockService.delete({})).rejects.toThrowError(BrandNotDefinedError);
  });

  test("viewProducts calls repository's viewProducts method", async () => {
    await mockService.viewProducts(1);
    expect(repositoryMock.viewProducts).toHaveBeenCalledTimes(1);
  });

  test('viewProducts throws an error if brand Id is not a number', async () => {
    await expect(mockService.viewProducts()).rejects.toThrowError(BrandIdNotDefinedError);
  });
});
