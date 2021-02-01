const { fromModelToEntity } = require('../mapper/categoryMapper');
const {
  fromModelToEntity: fromModelToProductEntity,
} = require('../../product/mapper/productMapper');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoriesIdsNotDefinedError = require('../error/CategoriesIdsNotDefinedError');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotFoundError = require('../error/CategoryNotFoundError');
const CategoriesIdsNotFoundError = require('../error/CategoriesIdsNotFoundError');
const Category = require('../entity/Category');

module.exports = class CategoryRepository {
  /**
   * @param {typeof import('../model/categoryModel')} categoryModel
   * @param {typeof import('../../product/model/productModel')} productModel
   * @param {typeof import('../../discount/model/discountModel')} discountModel
   */
  constructor(categoryModel, productModel, discountModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
    this.discountModel = discountModel;
  }

  /**
   * @param {import('../entity/Category')} category
   * @param {Array} discountsIds
   */
  async save(category, discountsIds = []) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    let categoryModel;
    const buildOptions = { isNewRecord: !category.id };
    categoryModel = this.categoryModel.build(category, buildOptions);
    categoryModel = await categoryModel.save();

    if (!buildOptions.isNewRecord) {
      const currentDiscounts = await categoryModel.getDiscounts();
      const discountsId = currentDiscounts.map((discount) => discount.id);
      await categoryModel.removeDiscount(discountsId);
    }

    discountsIds.map(async (id) => {
      await categoryModel.addDiscount(id);
    });

    return fromModelToEntity(categoryModel);
  }

  async getAll() {
    const categoryInstances = await this.categoryModel.findAll({
      include: {
        model: this.discountModel,
        as: 'discounts',
      },
    });

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
      include: {
        model: this.discountModel,
        as: 'discounts',
      },
    });
    if (!categoryInstance) {
      throw new CategoryNotFoundError(`There is no existing category with ID ${categoryId}`);
    }

    return fromModelToEntity(categoryInstance);
  }

  /**
   * @param {Array} categoriesIds
   */
  async getByIds(categoriesIds) {
    if (!Array.isArray(categoriesIds)) {
      throw new CategoriesIdsNotDefinedError();
    }
    const categoriesInstance = await this.categoryModel.findAll({
      where: {
        id: categoriesIds,
      },
      include: {
        model: this.discountModel,
        as: 'discounts',
      },
    });
    if (!categoriesInstance) {
      throw new CategoriesIdsNotFoundError(
        `There is no existing categories with IDs ${categoriesIds}`
      );
    }
    return categoriesInstance.map(fromModelToEntity);
  }

  /**
   * @param {import('../entity/Category')} category
   * @returns {Promise<Boolean>} Returns true if a category was deleted, otherwise it returns false
   */
  async delete(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    return Boolean(await this.categoryModel.destroy({ where: { id: category.id } }));
  }

  /**
   * @param {number} categoryId
   */
  async viewProducts(categoryId) {
    const products = await this.categoryModel.findByPk(categoryId, {
      include: [
        {
          model: this.productModel,
          as: 'products',
          include: [
            {
              model: this.discountModel,
              as: 'discounts',
            },
          ],
        },
        {
          model: this.discountModel,
          as: 'discounts',
        },
      ],
      limit: 5,
    });

    return products.products.map((product) => {
      product.discounts.push(...products.discounts);
      return fromModelToProductEntity(product);
    });
  }
};
