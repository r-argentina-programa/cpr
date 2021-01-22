const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoriesIdsNotDefinedError = require('../error/CategoriesIdsNotDefinedError');
const Category = require('../entity/Category');

module.exports = class CategoryService {
  /**
   * @param  {import("../repository/categoryRepository")} CategoryRepository
   */
  constructor(CategoryRepository) {
    this.CategoryRepository = CategoryRepository;
  }

  /**
   * @param {Category} category
   */
  async save(category, discounts) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }
    return this.CategoryRepository.save(category, discounts);
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

  async getByIds(categoriesIds) {
    if (!Array(categoriesIds)) {
      throw new CategoriesIdsNotDefinedError();
    }
    return this.CategoryRepository.getByIds(categoriesIds);
  }

  /**
   * @param {Category} category
   */
  async delete(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    return this.CategoryRepository.delete(category);
  }

  /**
   * @param {number} categoryId
   */
  async viewProducts(categoryId) {
    return this.CategoryRepository.viewProducts(categoryId);
  }
};
