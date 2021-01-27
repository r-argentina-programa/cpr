const ProductService = require('../productService');
const ProductNotDefinedError = require('../../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const ProductTestProduct = require('../../controller/__test__/products.fixture');
const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');
const createTestCategory = require('../../../category/controller/__test__/categories.fixture');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByIds: jest.fn(),
  delete: jest.fn(),
  getAllProductsSearch: jest.fn(),
  getAllByCategoryAndBrand: jest.fn(),
};

const discountServiceMock = {
  getByIds: jest.fn(() => Array.from({ length: 3 }, (id) => createTestDiscount(id + 1))),
};

const categoryServiceMock = {
  getByIds: jest.fn(() =>
    Array.from({ length: 3 }, (id) => createTestCategory(id + 1, discountServiceMock.getByIds([1])))
  ),
};

const mockService = new ProductService(repositoryMock, categoryServiceMock, discountServiceMock);

describe('ProductService methods', () => {
  test("save calls repository's save method without categories and discounts", async () => {
    const product = ProductTestProduct(1);
    await mockService.save(product);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(product, undefined, undefined);
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

  test("getByIds calls repository's getByIds method", async () => {
    const productIdsMock = [1, 2, 3];
    await mockService.getByIds(productIdsMock);
    expect(repositoryMock.getByIds).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(productIdsMock);
  });

  test('getById throws error if param is not an array', async () => {
    const productIdsMock = '';

    await expect(mockService.getByIds(productIdsMock)).rejects.toThrowError(
      ProductIdNotDefinedError
    );
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

  test('validateProductsDiscounts throws an error if the price after discount is zero or less', async () => {
    const productMock = ProductTestProduct(1, 40);

    await expect(mockService.validateProductsDiscounts(productMock, [1])).rejects.toThrowError();
  });

  test('validateCategoriesDiscounts throws an error if the price after discount is zero or less', async () => {
    const productMock = ProductTestProduct(1, 40);

    await expect(mockService.validateCategoriesDiscounts(productMock, [1])).rejects.toThrowError();
  });

  test("getAllByCategoryAndBrand calls repository's getAllByCategoryAndBrand", async () => {
    const categoriesMock = ['category1', 'category2'];
    const brandsMock = ['brand1', 'brand2'];
    const priceMock = 100;

    await mockService.getAllByCategoryAndBrand(categoriesMock, brandsMock, priceMock);
    expect(repositoryMock.getAllByCategoryAndBrand).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getAllByCategoryAndBrand).toHaveBeenCalledWith(
      categoriesMock,
      brandsMock,
      priceMock
    );
  });
});
