module.exports = class Product {
  constructor({
    id,
    name,
    defaultPrice,
    imageSrc,
    description,
    brand,
    categories = [],
    discounts,
    updatedAt,
    createdAt,
    deletedAt,
  }) {
    this.id = id;
    this.name = name;
    this.defaultPrice = defaultPrice;
    this.imageSrc = imageSrc;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.brand = brand;
    this.categories = categories;
    this.discounts = discounts;
  }
};
