const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoriesIdsNotDefinedError = require('../error/CategoriesIdsNotDefinedError');
const Category = require('../entity/Category');

module.exports = class CategoryService {
  /**
   * @param  {import("../repository/categoryRepository")} categoryRepository
   */
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  /**
   * @param {Category} category
   */
  async save(category, discountsIds) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }
    return this.categoryRepository.save(category, discountsIds);
  }

  async getAll() {
    return this.categoryRepository.getAll();
  }

  /**
   * @param {number} categoryId
   */
  async getById(categoryId) {
    if (!Number(categoryId)) {
      throw new CategoryIdNotDefinedError();
    }
    return this.categoryRepository.getById(categoryId);
  }

  async getByIds(categoriesIds) {
    if (!Array.isArray(categoriesIds)) {
      throw new CategoriesIdsNotDefinedError();
    }
    return this.categoryRepository.getByIds(categoriesIds);
  }

  /**
   * @param {Category} category
   */
  async delete(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    return this.categoryRepository.delete(category);
  }

  /**
   * @param {number} categoryId
   */
  async viewProducts(categoryId) {
    return this.categoryRepository.viewProducts(categoryId);
  }
};
