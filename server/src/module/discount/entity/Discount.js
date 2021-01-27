module.exports = class Discount {
  /**
   * @param {number} id
   * @param {string} type
   * @param {string} value
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, type, value, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
