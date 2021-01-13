const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const Category = require('../entity/Category');

module.exports = class CategoryService {
  /**
   * @param  {import("../repository/categoryRepository")} CategoryRepository
   */
  constructor(CategoryRepository) {
    this.CategoryRepository = CategoryRepository;
  }

  /**
   * @param {import('../entity/Category')} category
   */
  async save(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }
    return this.CategoryRepository.save(category);
  }

  async getAll() {
    return this.CategoryRepository.getAll();
  }

  /**
   * @param {number} categoryId
   */
  async getById(categoryId) {
    if (!Number(categoryId)) {
      throw new CategoryIdNotDefinedError();
    }
    return this.CategoryRepository.getById(categoryId);
  }
};
