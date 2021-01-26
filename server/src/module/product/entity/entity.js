module.exports = class Product {
  constructor({
    id,
    name,
    defaultPrice,
    imageSrc,
    description,
    brandFk,
    brand,
    categories = [],
    discount,
    discounts,
    updatedAt,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.defaultPrice = defaultPrice;
    this.discount = discount;
    this.imageSrc = imageSrc;
    this.description = description;
    this.brandFk = brandFk;
    this.brand = brand;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.categories = categories;
    this.discounts = discounts;
  }
};