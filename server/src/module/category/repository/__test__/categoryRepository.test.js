const { Sequelize } = require('sequelize');
const CategoryRepository = require('../categoryRepository');
const categoryModel = require('../../model/categoryModel');
const productModel = require('../../../product/model/productModel');
const discountModel = require('../../../discount/model/discountModel');
const createTestCategory = require('../../controller/__test__/categories.fixture');
const CategoryNotDefinedError = require('../../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const CategoryIdsNotDefinedError = require('../../error/CategoriesIdsNotDefinedError');
const CategoryNotFoundError = require('../../error/CategoryNotFoundError');

describe('categoryRepository methods', () => {
  let sequelize, CategoryModel, ProductModel, DiscountModel, categoryRepository;
  beforeEach(async (done) => {
    sequelize = new Sequelize('sqlite::memory', { logging: false });
    CategoryModel = categoryModel.setup(sequelize);
    ProductModel = productModel.setup(sequelize);
    DiscountModel = discountModel.setup(sequelize);
    CategoryModel.belongsToMany(ProductModel, {
      through: 'category_products',
      foreignKey: 'category_id',
      as: 'products',
    });
    CategoryModel.belongsToMany(DiscountModel, {
      through: 'discount_category',
      foreignKey: 'category_id',
      as: 'discounts',
    });
    ProductModel.belongsToMany(CategoryModel, {
      through: 'category_products',
      foreignKey: 'product_id',
      as: 'categories',
    });
    DiscountModel.belongsToMany(ProductModel, { through: 'discount_products' });
    DiscountModel.belongsToMany(CategoryModel, { through: 'discount_category' });
    categoryRepository = new CategoryRepository(CategoryModel, ProductModel, DiscountModel);
    await sequelize.sync({ force: true });
    done();
  });

  afterAll(async (done) => {
    await sequelize.close();
  });

  test('saves a new category in DB', async () => {
    const category = createTestCategory();
    const { id, name } = await categoryRepository.save(category);
    expect(id).toEqual(1);
    expect(name).toEqual(category.name);
  });

  test('saves two categories in DB, second should have id+1', async () => {
    const category1 = createTestCategory();
    const category2 = createTestCategory(undefined, undefined, 'house articles');

    const savedcategory = await categoryRepository.save(category1);
    const savedcategory2 = await categoryRepository.save(category2);
    expect(savedcategory.id).toEqual(1);
    expect(savedcategory2.id).toEqual(2);
  });

  test('updates one category', async () => {
    const category = createTestCategory(1);
    const savedcategory = await categoryRepository.save(category);
    expect(savedcategory.id).toEqual(1);
    expect(savedcategory.name).toEqual(category.name);

    const newcategoryName = 'Toys';
    expect(savedcategory.name).not.toEqual(newcategoryName);

    category.name = newcategoryName;
    const updatedcategory = await categoryRepository.save(category);
    expect(updatedcategory.id).toEqual(savedcategory.id);
    expect(updatedcategory.name).toEqual(newcategoryName);
    expect(updatedcategory.logo).toEqual(savedcategory.logo);
  });

  test('save throws error because argument type is not instaceof Category', async () => {
    const category = {
      id: 1,
      name: 'Toys',
    };
    await expect(categoryRepository.save(category)).rejects.toThrowError(CategoryNotDefinedError);
  });

  test('getAll returns all categories stored in DB', async () => {
    const category1 = createTestCategory();
    const category2 = createTestCategory(undefined, undefined, 'house article');
    await categoryRepository.save(category1);
    await categoryRepository.save(category2);
    const categories = await categoryRepository.getAll();

    expect(categories).toHaveLength(2);
  });

  test('getAllCount returns a count of all categories stored in DB', async () => {
    const category1 = createTestCategory();
    const category2 = createTestCategory(undefined, undefined, 'house article');
    await categoryRepository.save(category1);
    await categoryRepository.save(category2);
    const categoriesCount = await categoryRepository.getAllCount();

    expect(categoriesCount).toEqual(2);
  });

  test('getById returns a single category', async () => {
    const category = createTestCategory();
    await categoryRepository.save(category);

    const fetchedCategory = await categoryRepository.getById(1);
    expect(fetchedCategory.id).toEqual(1);
    expect(fetchedCategory.name).toEqual(category.name);
  });

  test('getById throws error because id is not passed as argument', async () => {
    await expect(categoryRepository.getById()).rejects.toThrowError(CategoryIdNotDefinedError);
  });

  test('getById throws error because category with that id doesnt exist', async () => {
    await expect(categoryRepository.getById(3)).rejects.toThrowError(CategoryNotFoundError);
  });

  test('getByIds fetches categories by ids', async () => {
    const category1 = createTestCategory();
    const category2 = createTestCategory(undefined, undefined, 'house article');
    const category3 = createTestCategory(undefined, undefined, 'skin care');
    await categoryRepository.save(category1);
    await categoryRepository.save(category2);
    await categoryRepository.save(category3);

    const categoriesIds = [1, 2, 3];
    const fetchedCategories = await categoryRepository.getByIds(categoriesIds);
    expect(fetchedCategories).toHaveLength(3);
  });

  test('getByIds throws error if parameter is not defined', async () => {
    const categoriesIds = '';
    await expect(categoryRepository.getByIds(categoriesIds)).rejects.toThrowError(
      CategoryIdsNotDefinedError
    );
  });

  test('deletes an existing category in DB and returns true', async () => {
    const category1 = createTestCategory();
    const category2 = createTestCategory(undefined, undefined, 'house article');
    const category3 = createTestCategory(undefined, undefined, 'skin care');
    await categoryRepository.save(category1);
    await categoryRepository.save(category2);
    await categoryRepository.save(category3);

    const fetchedCategory = await categoryRepository.getById(2);
    const deletedCategory = await categoryRepository.delete(fetchedCategory);
    const remainingcategorys = await categoryRepository.getAll();

    expect(deletedCategory).toEqual(true);
    expect(remainingcategorys[0].id).toEqual(1);
    expect(remainingcategorys[1].id).toEqual(3);
  });

  test('delete throws error because category is not defined', async () => {
    await expect(categoryRepository.delete({})).rejects.toThrowError(CategoryNotDefinedError);
  });

  test('delete throws error because category is not intanceof Category', async () => {
    const category = {
      id: 1,
      name: 'Toys',
    };
    await expect(categoryRepository.delete(category)).rejects.toThrowError(CategoryNotDefinedError);
  });
});
