module.exports = class Product {
  constructor({ id, name, defaultPrice, imageSrc, description, brand_fk, updatedAt, createdAt }) {
    this.id = id;
    this.name = name;
    this.defaultPrice = defaultPrice;
    this.imageSrc = imageSrc;
    this.description = description;
    this.fkBrand = brand_fk;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
};
