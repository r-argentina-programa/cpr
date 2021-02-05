const { Sequelize } = require('sequelize');
const ProductRepository = require('../productRepository');
const productModel = require('../../model/productModel');
const categoryModel = require('../../../category/model/categoryModel');
const brandModel = require('../../../brand/model/brandModel');
const discountModel = require('../../../discount/model/discountModel');
const createTestProduct = require('../../controller/__test__/products.fixture');
const createTestBrand = require('../../../brand/controller/__test__/brands.fixture');
const ProductNotDefinedError = require('../../error/ProductNotDefinedError');
const ProductIdNotDefinedError = require('../../error/ProductIdNotDefinedError');
const ProductNotFoundError = require('../../error/ProductNotFoundError');

describe('productRepository methods', () => {
  let sequelize;
  let ProductModel;
  let CategoryModel;
  let BrandModel;
  let DiscountModel;
  let productRepository;

  beforeEach(async (done) => {
    sequelize = new Sequelize('sqlite::memory', { logging: false });
    CategoryModel = categoryModel.setup(sequelize);
    ProductModel = productModel.setup(sequelize);
    DiscountModel = discountModel.setup(sequelize);
    BrandModel = brandModel.setup(sequelize);

    ProductModel.setupAssociation(CategoryModel, BrandModel, DiscountModel);
    BrandModel.setupAssociation(ProductModel, DiscountModel);
    CategoryModel.setupAssociation(ProductModel, DiscountModel);
    DiscountModel.setupAssociation(ProductModel, CategoryModel, BrandModel);

    productRepository = new ProductRepository(
      ProductModel,
      CategoryModel,
      BrandModel,
      DiscountModel
    );
    await sequelize.sync({ force: true });
    done();
  });

  afterAll(async (done) => {
    await sequelize.close();
  });

  test('save saves a new product in DB', async () => {
    const brandMock = createTestBrand(3);
    const brand = BrandModel.build(brandMock);
    brand.save();

    const product = createTestProduct();
    const { id, name, defaultPrice, description } = await productRepository.save(product);

    expect(id).toEqual(1);
    expect(name).toEqual(product.name);
    expect(defaultPrice).toEqual(product.defaultPrice);
    expect(description).toEqual(product.description);
  });

  test('save throws error if product is not an instance of a product', async () => {
    const productMock = '';
    await expect(productRepository.save(productMock)).rejects.toThrowError(ProductNotDefinedError);
  });

  test('save updates the categories and discounts if the product is not new', async () => {});

  test('getById returns an instance of a product', async () => {
    const brandMock = createTestBrand(3);
    const brand = BrandModel.build(brandMock);
    await brand.save();

    const productMock = createTestProduct(1);
    const product = ProductModel.build(productMock);
    await product.save();

    const fetchedProduct = await productRepository.getById(1);
    expect(fetchedProduct.id).toEqual(1);
  });

  test('getById throws an error if there is no id parameter', async () => {
    const idMock = '';
    await expect(productRepository.getById(idMock)).rejects.toThrowError(ProductIdNotDefinedError);
  });

  test('getById throws an error if the id is not in the DB', async () => {
    const idMock = 1000;
    await expect(productRepository.getById(idMock)).rejects.toThrowError(ProductNotFoundError);
  });

  test('delete returns the number of deleted products', async () => {
    const brandMock = createTestBrand(3);
    const brand = BrandModel.build(brandMock);
    await brand.save();

    const productMock = createTestProduct(1);
    const product = ProductModel.build(productMock);
    await product.save();

    const deletedProduct = await productRepository.delete(productMock);
    expect(deletedProduct).toEqual(1);
  });

  test('delete throws an error if the parameter is incorrect', async () => {
    const productMock = '';
    await expect(productRepository.delete(productMock)).rejects.toThrowError(ProductNotFoundError);
  });

  test('getAll fetches all products', async () => {
    const brandMock = createTestBrand(3);
    const brand = BrandModel.build(brandMock);
    await brand.save();

    const productMock1 = createTestProduct();
    const product1 = ProductModel.build(productMock1);
    await product1.save();

    const productMock2 = createTestProduct();
    const product2 = ProductModel.build(productMock2);
    await product2.save();

    const fetchedProducts = await productRepository.getAll();
    expect(fetchedProducts.length).toEqual(2);
  });

  test('getFilteredProducts fetches products by categories and brands', async () => {});

  test('getByIds fetches products by a list of ids', async () => {
    const brandMock = createTestBrand(3);
    const brand = BrandModel.build(brandMock);
    await brand.save();

    const productMock1 = createTestProduct(1);
    const product1 = ProductModel.build(productMock1);
    await product1.save();

    const productMock2 = createTestProduct(2);
    const product2 = ProductModel.build(productMock2);
    await product2.save();

    const fetchedProducts = await productRepository.getByIds([1, 2]);
    expect(fetchedProducts.length).toEqual(2);
  });

  test('getByIds throws an error if the parameter is not an array', async () => {
    const productIdsMock = '';

    await expect(productRepository.getByIds(productIdsMock)).rejects.toThrowError(
      ProductIdNotDefinedError
    );
  });
});
