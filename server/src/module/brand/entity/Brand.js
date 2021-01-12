module.exports = class Brand {
  constructor({ id, name, logo, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.name = name;
    this.logo = logo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
