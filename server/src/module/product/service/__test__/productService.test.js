const ProductService = require('../productService');
const ProductNotDefinedError = require('../../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const ProductTestProduct = require('../../controller/__test__/products.fixture');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  getAllProductsSearch: jest.fn(),
};

const mockService = new ProductService(repositoryMock);

describe('ProductService methods', () => {
  test("save calls repository's save method without categories", async () => {
    const product = ProductTestProduct(1);
    await mockService.save(product);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(product, undefined);
  });

  test('save throws an error if param is not instance of Product', async () => {
    await expect(mockService.save({})).rejects.toThrowError(ProductNotDefinedError);
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
    await expect(mockService.getById()).rejects.toThrowError(ProductIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const product = ProductTestProduct(1);
    await mockService.delete(product);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(product);
  });

  test('delete throws an error if param is not instance of Product', async () => {
    await expect(mockService.delete({})).rejects.toThrowError(ProductNotDefinedError);
  });

  test('getAllProductsSearch calls repository getAllProductsSearch method', async () => {
    const searchTerm = 'Computer';
    await mockService.getAllProductsSearch(searchTerm);
    expect(repositoryMock.getAllProductsSearch).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getAllProductsSearch).toHaveBeenCalledWith(searchTerm);
  });
});
