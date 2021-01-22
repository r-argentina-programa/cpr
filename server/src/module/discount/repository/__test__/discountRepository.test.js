const { Sequelize } = require('sequelize');
const DiscountRepository = require('../discountRepository');
const createTestDiscount = require('../../controller/__test__/discount.fixture');
const DiscountNotDefinedError = require('../../error/DiscountNotDefinedError');
const DiscountIdNotDefinedError = require('../../error/DiscountIdNotDefinedError');
const DiscountNotFoundError = require('../../error/DiscountNotFoundError');
const discountModel = require('../../model/discountModel');
const categoryModel = require('../../../category/model/categoryModel');
const productModel = require('../../../product/model/productModel');
const brandModel = require('../../../brand/model/brandModel');
const discountTypeModel = require('../../model/discountTypeModel');

describe('discountRepository methods', () => {
  let sequelize;
  let discountRepository;
  let DiscountModel;
  let CategoryModel;
  let ProductModel;
  let BrandModel;
  let DiscountTypeModel;

  beforeEach(async (done) => {
    sequelize = new Sequelize('sqlite::memory');
    DiscountModel = discountModel.setup(sequelize);
    CategoryModel = categoryModel.setup(sequelize);
    ProductModel = productModel.setup(sequelize);
    BrandModel = brandModel.setup(sequelize);
    DiscountTypeModel = discountTypeModel.setup(sequelize);

    ProductModel.belongsToMany(DiscountModel, {
      through: 'discount_products',
      foreignKey: 'product_id',
      as: 'discounts',
    });
    CategoryModel.belongsToMany(DiscountModel, {
      through: 'discount_category',
      foreignKey: 'category_id',
      as: 'discounts',
    });

    BrandModel.belongsToMany(DiscountModel, {
      through: 'discount_brand',
      foreignKey: 'brand_id',
      as: 'discounts',
    });
    DiscountModel.belongsToMany(ProductModel, { through: 'discount_products' });
    DiscountModel.belongsToMany(CategoryModel, { through: 'discount_category' });
    DiscountModel.belongsToMany(BrandModel, { through: 'discount_brand' });

    discountRepository = new DiscountRepository(DiscountModel, DiscountTypeModel);
    await sequelize.sync({ force: true });
    done();
  });

  afterAll(async (done) => {
    await sequelize.close();
  });

  test('saves a new discount in DB', async () => {
    const discount = createTestDiscount();

    const { id, name } = await discountRepository.save(discount);
    expect(id).toEqual(1);
    expect(name).toEqual(discount.name);
  });

  test('saves two discounts in DB, second should have id+1', async () => {
    const discount1 = createTestDiscount();
    const discount2 = createTestDiscount();

    const saveddiscount = await discountRepository.save(discount1);
    const saveddiscount2 = await discountRepository.save(discount2);
    expect(saveddiscount.id).toEqual(1);
    expect(saveddiscount2.id).toEqual(2);
  });

  test('updates one discount', async () => {
    const discount = createTestDiscount(1);
    const savedDiscount = await discountRepository.save(discount);
    expect(savedDiscount.id).toEqual(1);
    expect(savedDiscount.type).toEqual(discount.type);

    const newDiscountType = 'Percentage';
    expect(savedDiscount.type).not.toEqual(newDiscountType);

    discount.type = newDiscountType;
    const updatedDiscount = await discountRepository.save(discount);
    expect(updatedDiscount.id).toEqual(savedDiscount.id);
    expect(updatedDiscount.type).toEqual(newDiscountType);
    expect(updatedDiscount.logo).toEqual(savedDiscount.logo);
  });

  test('save throws error because argument type is not instance of Discount', async () => {
    const discount = {
      id: 1,
      type: 'Percentage',
      value: '10',
    };
    await expect(discountRepository.save(discount)).rejects.toThrowError(DiscountNotDefinedError);
  });

  test('getAll returns all discounts stored in DB', async () => {
    const discount = createTestDiscount();
    await discountRepository.save(discount);
    await discountRepository.save(discount);
    const discounts = await discountRepository.getAll();

    expect(discounts).toHaveLength(2);
  });

  test('getById returns a single discount', async () => {
    const discount = createTestDiscount();
    await discountRepository.save(discount);

    const fetcheddiscount = await discountRepository.getById(1);
    expect(fetcheddiscount.id).toEqual(1);
    expect(fetcheddiscount.name).toEqual(discount.name);
  });

  test('getById throws error because id is not passed as argument', async () => {
    await expect(discountRepository.getById()).rejects.toThrowError(DiscountIdNotDefinedError);
  });

  test('getById throws error because discount with that id doesnt exist', async () => {
    await expect(discountRepository.getById(3)).rejects.toThrowError(DiscountNotFoundError);
  });

  test('deletes an existing discount in DB and returns true', async () => {
    const discount = createTestDiscount();
    await discountRepository.save(discount);
    await discountRepository.save(discount);
    await discountRepository.save(discount);

    const fetchedDiscount = await discountRepository.getById(2);
    const deletedDiscount = await discountRepository.delete(fetchedDiscount);
    const remainingDiscounts = await discountRepository.getAll();

    expect(deletedDiscount).toEqual(true);
    expect(remainingDiscounts[0].id).toEqual(1);
    expect(remainingDiscounts[1].id).toEqual(3);
  });

  test('delete throws error because discount is not defined', async () => {
    await expect(discountRepository.delete({})).rejects.toThrowError(DiscountNotDefinedError);
  });
});
