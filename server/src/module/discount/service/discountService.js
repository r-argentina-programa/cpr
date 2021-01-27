const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');
const DiscountNotDefinedError = require('../error/DiscountNotDefinedError');
const DiscountsIdsNotDefinedError = require('../error/DiscountsIdsNotDefinedError');
const Discount = require('../entity/Discount');

module.exports = class DiscountService {
  /**
   * @param  {import("../repository/discountRepository")} discountRepository
   */
  constructor(discountRepository) {
    this.discountRepository = discountRepository;
  }

  /**
   * @param {import('../entity/Discount')} discount
   */
  async save(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }
    return this.discountRepository.save(discount);
  }

  async getAll() {
    return this.discountRepository.getAll();
  }

  /**
   * @param {number} discountId
   */
  async getById(discountId) {
    if (!Number(discountId)) {
      throw new DiscountIdNotDefinedError();
    }
    return this.discountRepository.getById(discountId);
  }

  /**
   * @param {Array} discountsIds
   */
  async getByIds(discountsIds) {
    if (!Array.isArray(discountsIds)) {
      throw new DiscountsIdsNotDefinedError();
    }
    return this.discountRepository.getByIds(discountsIds);
  }

  /**
   * @param {import('../entity/Discount')} discount
   */
  async delete(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }

    return this.discountRepository.delete(discount);
  }
};
