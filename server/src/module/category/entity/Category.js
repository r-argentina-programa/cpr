module.exports = class Category {
  /**
   * @param {number} id
   * @param {string} name
   * @param {object} discounts
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, name, discounts, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.discounts = discounts;
  }
};
