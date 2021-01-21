const { fromModelToEntity } = require('../mapper/categoryMapper');
const { fromModelToEntity: fromModelToProductEntity } = require('../../product/mapper/mapper');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotFoundError = require('../error/CategoryNotFoundError');
const Category = require('../entity/Category');
const DiscountModel = require('../../discount/model/discountModel');

module.exports = class CategoryRepository {
  /**
   * @param {typeof import('../model/categoryModel')} categoryModel
   */
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  /**
   * @param {import('../entity/Category')} category
   */
  async save(category, discounts = []) {
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

    discounts.map(async (id) => {
      await categoryModel.addDiscount(id);
    });

    return fromModelToEntity(categoryModel);
  }

  async getAll() {
    const categoryInstances = await this.categoryModel.findAll({
      include: {
        model: DiscountModel,
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
        model: DiscountModel,
        as: 'discounts',
      },
    });
    if (!categoryInstance) {
      throw new CategoryNotFoundError(`There is no existing category with ID ${categoryId}`);
    }

    return fromModelToEntity(categoryInstance);
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
              model: DiscountModel,
              as: 'discounts',
            },
          ],
        },
        {
          model: DiscountModel,
          as: 'discounts',
        },
      ],
    });

    return products.products.map((product) => {
      product.discounts.push(...products.discounts);
      return fromModelToProductEntity(product);
    });
  }
};
