module.exports = class Brand {
  constructor({ id, name, createdAt, updatedAt, deletedAt}) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
