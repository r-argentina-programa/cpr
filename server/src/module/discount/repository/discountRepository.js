const { fromModelToEntity } = require('../mapper/discountMapper');
const DiscountNotDefinedError = require('../error/DiscountNotDefinedError');
const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');
const DiscountNotFoundError = require('../error/DiscountNotFoundError');
const Discount = require('../entity/Discount');
//const DiscountType = require('../entity/discountType');
// const { fromModelToEntity: fromModelToTypeEntity } = require('../mapper/discountTypeMapper');

module.exports = class DiscountRepository {
  /**
   * @param {typeof import('../model/discountModel')} discountModel
   * @param {typeof import('../model/discountTypeModel')} discountTypeModel
   */
  constructor(discountModel, discountTypeModel) {
    this.discountModel = discountModel;
    this.discountTypeModel = discountTypeModel;
  }

  /**
   * @param { Discount } discount
   */
  async save(discount) {
    console.log('repo', discount);
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }
    let discountModel;
    discountModel = this.discountModel.build(discount);

    discountModel = await discountModel.save();

    return fromModelToEntity(discountModel);
  }

  async saveType(type) {
    let newType;
    const buildOptions = { isNewRecord: !type.id };
    newType = this.discountTypeModel.build(type, buildOptions);
    newType = await this.discountTypeModel.save();

    // return fromModelToEntity(newType);
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
