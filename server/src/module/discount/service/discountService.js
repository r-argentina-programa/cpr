const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');
const DiscountNotDefinedError = require('../error/DiscountNotDefinedError');
const DiscountsIdsNotDefinedError = require('../error/DiscountsIdsNotDefinedError');
const Discount = require('../entity/Discount');

module.exports = class DiscountService {
  /**
   * @param  {import("../repository/discountRepository")} DiscountRepository
   */
  constructor(DiscountRepository) {
    this.DiscountRepository = DiscountRepository;
  }

  /**
   * @param {import('../entity/Discount')} discount
   */
  async save(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }
    return this.DiscountRepository.save(discount);
  }

  async getAll() {
    return this.DiscountRepository.getAll();
  }

  /**
   * @param {number} discountId
   */
  async getById(discountId) {
    if (!Number(discountId)) {
      throw new DiscountIdNotDefinedError();
    }
    return this.DiscountRepository.getById(discountId);
  }

  /**
   * @param {Array} discountsIds
   */
  async getByIds(discountsIds) {
    if (!Array(discountsIds)) {
      throw new DiscountsIdsNotDefinedError();
    }
    return this.DiscountRepository.getByIds(discountsIds);
  }

  /**
   * @param {import('../entity/Discount')} discount
   */
  async delete(discount) {
    if (!(discount instanceof Discount)) {
      throw new DiscountNotDefinedError();
    }

    return this.DiscountRepository.delete(discount);
  }

  async saveType(type) {
    return this.DiscountRepository.saveType(type);
  }
};
