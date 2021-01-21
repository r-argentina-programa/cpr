const { Sequelize } = require('sequelize');
const CategoryRepository = require('../categoryRepository');
const categoryModel = require('../../model/categoryModel');
const productModel = require('../../../product/model/productModel');
const createTestCategory = require('../../controller/__test__/categories.fixture');
const CategoryNotDefinedError = require('../../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../../error/CategoryIdNotDefinedError');
const CategoryNotFoundError = require('../../error/CategoryNotFoundError');

describe('categoryRepository methods', () => {
  let sequelize, CategoryModel, ProductModel, categoryRepository;
  beforeEach(async (done) => {
    sequelize = new Sequelize('sqlite::memory');
    CategoryModel = categoryModel.setup(sequelize);
    ProductModel = productModel.setup(sequelize);
    CategoryModel.belongsToMany(ProductModel, {
      through: 'category_products',
      foreignKey: 'category_id',
      as: 'products',
    });
    ProductModel.belongsToMany(CategoryModel, {
      through: 'category_products',
      foreignKey: 'product_id',
      as: 'categories',
    });
    categoryRepository = new CategoryRepository(CategoryModel, ProductModel);
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
    const category2 = createTestCategory();

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
    const category = createTestCategory();
    await categoryRepository.save(category);
    await categoryRepository.save(category);
    const categories = await categoryRepository.getAll();

    expect(categories).toHaveLength(2);
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

  test('deletes an existing category in DB and returns true', async () => {
    const category = createTestCategory();
    await categoryRepository.save(category);
    await categoryRepository.save(category);
    await categoryRepository.save(category);

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
