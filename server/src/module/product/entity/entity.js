module.exports = class Product {
  constructor({ id, name, defaultPrice, imageSrc, description, brandFk, updatedAt, createdAt }) {
    this.id = id;
    this.name = name;
    this.defaultPrice = defaultPrice;
    this.imageSrc = imageSrc;
    this.description = description;
    this.brandFk = brandFk;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
};
