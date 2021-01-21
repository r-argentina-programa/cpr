module.exports = class Discount {
  constructor({ id, type, updatedAt, createdAt, deletedAt }) {
    this.id = id;
    this.type = type;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }
};
