const { fromModelToEntity } = require('../mapper/categoryMapper');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotFoundError = require('../error/CategoryNotFoundError');
const Category = require('../entity/Category');

module.exports = class CategoryRepository {
  /**
   * @param {typeof import('../model/categoryModel')} categoryModel
   */
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  /**
   * @param {import('../entity/Category')} category
   */
  async save(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    const categoryInstance = this.categoryModel.build(category, {
      isNewRecord: !category.id,
    });
    await categoryInstance.save();
    return fromModelToEntity(categoryInstance);
  }

  async getAll() {
    const categoryInstances = await this.categoryModel.findAll();
    return categoryInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} categoryId
   */
  async getById(categoryId) {
    if (!Number(categoryId)) {
      throw new CategoryIdNotDefinedError();
    }
    const categoryInstance = await this.categoryModel.findByPk(categoryId, {
      include: CategoryModel,
    });
    if (!categoryInstance) {
      throw new CategoryNotFoundError(`There is no existing category with ID ${categoryId}`);
    }

    return fromModelToEntity(categoryInstance);
  }
};
