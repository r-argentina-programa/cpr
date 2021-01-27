const { fromModelToEntity } = require('../mapper/discountMapper');
const DiscountNotDefinedError = require('../error/DiscountNotDefinedError');
const DiscountsIdsNotDefinedError = require('../error/DiscountsIdsNotDefinedError');
const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');
const DiscountNotFoundError = require('../error/DiscountNotFoundError');
const DiscountsIdsNotFoundError = require('../error/DiscountsIdsNotFoundError');
const Discount = require('../entity/Discount');

module.exports = class DiscountRepository {
  /**
   * @param {typeof import('../model/discountModel')} discountModel
   */
  constructor(discountModel) {
    this.discountModel = discountModel;
  }

  /**
   * @param { Discount } discount
   */
  async save(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }
    let discountModel;
    const buildOptions = { isNewRecord: !discount.id };
    discountModel = this.discountModel.build(discount, buildOptions);
    discountModel = await discountModel.save();

    return fromModelToEntity(discountModel);
  }

  async getAll() {
    const discountInstances = await this.discountModel.findAll();
    return discountInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} discountId
   */
  async getById(discountId) {
    if (!Number(discountId)) {
      throw new DiscountIdNotDefinedError();
    }
    const discountInstance = await this.discountModel.findByPk(discountId);
    if (!discountInstance) {
      throw new DiscountNotFoundError(`There is not existing discount with ID ${discountId}`);
    }

    return fromModelToEntity(discountInstance);
  }

  /**
   * @param {Array} categoriesIds
   */
  async getByIds(discountsIds) {
    if (!Array.isArray(discountsIds)) {
      throw new DiscountsIdsNotDefinedError();
    }
    const discountsInstance = await this.discountModel.findAll({
      where: {
        id: discountsIds,
      },
    });
    if (!discountsInstance) {
      throw new DiscountsIdsNotFoundError(
        `There is no existing discounts with IDs ${discountsIds}`
      );
    }
    return discountsInstance.map(fromModelToEntity);
  }

  /**
   * @param {import('../entity/Discount')} discount
   * @returns {Promise<Boolean>} Returns true if a car was deleted, otherwise it returns false
   */
  async delete(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }

    return Boolean(await this.discountModel.destroy({ where: { id: discount.id } }));
  }
};
