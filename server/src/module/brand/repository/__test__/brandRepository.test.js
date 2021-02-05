const { Sequelize } = require('sequelize');
const BrandRepository = require('../brandRepository');
const brandModel = require('../../model/brandModel');
const discountModel = require('../../../discount/model/discountModel');
const productModel = require('../../../product/model/productModel');
const categoryModel = require('../../../category/model/categoryModel');
const createTestBrand = require('../../controller/__test__/brands.fixture');
const createTestProduct = require('../../../product/controller/__test__/products.fixture');
const BrandNotDefinedError = require('../../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../../error/BrandIdNotDefinedError');
const BrandNotFoundError = require('../../error/BrandNotFoundError');

describe('BrandRepository methods', () => {
  let sequelize;
  let BrandModel;
  let ProductModel;
  let CategoryModel;
  let DiscountModel;
  let brandRepository;
  beforeEach(async (done) => {
    sequelize = new Sequelize('sqlite::memory', { logging: false });
    BrandModel = brandModel.setup(sequelize);
    ProductModel = productModel.setup(sequelize);
    CategoryModel = categoryModel.setup(sequelize);
    DiscountModel = discountModel.setup(sequelize);

    ProductModel.setupAssociation(CategoryModel, BrandModel, DiscountModel);
    CategoryModel.setupAssociation(ProductModel, DiscountModel);
    BrandModel.setupAssociation(ProductModel, DiscountModel);
    DiscountModel.setupAssociation(ProductModel, CategoryModel, BrandModel);

    brandRepository = new BrandRepository(BrandModel, ProductModel, CategoryModel, DiscountModel);
    await sequelize.sync({ force: true });
    done();
  });

  test('saves a new brand in DB', async () => {
    const brand = createTestBrand();
    const { id, name, logo } = await brandRepository.save(brand);
    expect(id).toEqual(1);
    expect(name).toEqual(brand.name);
    expect(logo).toEqual(brand.logo);
  });

  test('saves two brands in DB, second should have id+1', async () => {
    const brand1 = createTestBrand(undefined, 'Coca-cola');
    const brand2 = createTestBrand(undefined, 'Sprite');

    const savedBrand = await brandRepository.save(brand1);
    const savedBrand2 = await brandRepository.save(brand2);
    expect(savedBrand.id).toEqual(1);
    expect(savedBrand2.id).toEqual(2);
  });

  test('updates one brand', async () => {
    const brand = createTestBrand(1);
    const savedBrand = await brandRepository.save(brand);
    expect(savedBrand.id).toEqual(1);
    expect(savedBrand.name).toEqual(brand.name);

    const newBrandName = 'pepsi';
    expect(savedBrand.name).not.toEqual(newBrandName);

    brand.name = newBrandName;
    const updatedBrand = await brandRepository.save(brand);
    expect(updatedBrand.id).toEqual(savedBrand.id);
    expect(updatedBrand.name).toEqual(newBrandName);
    expect(updatedBrand.logo).toEqual(savedBrand.logo);
  });

  test('save throws error because brand is not passed as argument', async () => {
    const brand = {
      id: 1,
      name: 'pepsi',
    };
    await expect(brandRepository.save(brand)).rejects.toThrowError(BrandNotDefinedError);
  });

  test('getAll returns all brands stored in DB', async () => {
    const brand1 = createTestBrand(undefined, 'Coca-cola');
    const brand2 = createTestBrand(undefined, 'Sprite');
    await brandRepository.save(brand1);
    await brandRepository.save(brand2);
    const brands = await brandRepository.getAll();

    expect(brands).toHaveLength(2);
    expect(brands[0].id).toEqual(1);
    expect(brands[1].id).toEqual(2);
  });

  test('getAllCount returns a count of all brands stored in DB', async () => {
    const brand1 = createTestBrand();
    const brand2 = createTestBrand(undefined, 'pepsi');
    await brandRepository.save(brand1);
    await brandRepository.save(brand2);
    const brandsCount = await brandRepository.getAllCount();

    expect(brandsCount).toEqual(2);
  });

  test('getById returns single brand', async () => {
    const brand = createTestBrand();
    await brandRepository.save(brand);

    const fetchedBrand = await brandRepository.getById(1);
    expect(fetchedBrand.id).toEqual(1);
    expect(fetchedBrand.name).toEqual(brand.name);
  });

  test('getById throws error on undefined brandId as argument', async () => {
    await expect(brandRepository.getById()).rejects.toThrowError(BrandIdNotDefinedError);
  });

  test('getById throws error because brand with that id doesnt exist', async () => {
    await expect(brandRepository.getById(3)).rejects.toThrowError(BrandNotFoundError);
  });

  test('deletes an existing brand in DB and returns true', async () => {
    const brand1 = createTestBrand(undefined, 'Coca-cola');
    const brand2 = createTestBrand(undefined, 'Sprite');
    const brand3 = createTestBrand(undefined, 'Fanta');
    await brandRepository.save(brand1);
    await brandRepository.save(brand2);
    await brandRepository.save(brand3);

    const fetchedBrand = await brandRepository.getById(2);
    const deletedBrand = await brandRepository.delete(fetchedBrand);
    const remainingBrands = await brandRepository.getAll();

    expect(deletedBrand).toEqual(true);
    expect(remainingBrands[0].id).toEqual(1);
    expect(remainingBrands[1].id).toEqual(3);
  });

  test('delete throws error because brandId is not defined', async () => {
    await expect(brandRepository.delete({})).rejects.toThrowError(BrandIdNotDefinedError);
  });

  test('viewProducts returns an array of products', async () => {
    const brandId = 3;
    const brandMock = createTestBrand(brandId);
    const brand = BrandModel.build(brandMock);
    await brand.save();

    const productId = 1;
    const productMock = createTestProduct(productId);
    const product = ProductModel.build(productMock);
    await product.save();

    const products = await brandRepository.viewProducts(brandId);
    expect(products.length).toEqual(1);
  });
});
