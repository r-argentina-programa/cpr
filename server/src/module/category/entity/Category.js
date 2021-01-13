module.exports = class Category {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} createdAt
   * @param {string} updatedAt
   */
  constructor({ id, name, updatedAt, createdAt }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
};
