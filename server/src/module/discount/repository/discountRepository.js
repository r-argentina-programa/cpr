const { fromModelToEntity } = require('../mapper/discountMapper');
const DiscountNotDefinedError = require('../error/DiscountNotDefinedError');
const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');
const DiscountNotFoundError = require('../error/DiscountNotFoundError');
const Discount = require('../entity/Discount');

module.exports = class DiscountRepository {
  /**
   * @param {typeof import('../model/discountModel')} discountModel
   */
  constructor(discountModel) {
    this.discountModel = discountModel;
  }

  /**
   * @param {import('../entity/Discount')} discount
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
      throw new DiscountNotFoundError(`There is no existing discount with ID ${discountId}`);
    }

    return fromModelToEntity(discountInstance);
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
