module.exports = class Brand {
  /**
   * @param {number} id
   * @param {string} name
   * @param {ArrayBuffer} logo
   * @param {object} discounts
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, name, logo, discounts, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.name = name;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.discounts = discounts;
  }
};
