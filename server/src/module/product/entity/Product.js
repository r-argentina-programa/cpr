module.exports = class Product {
  /**
   * @param {number} id
   * @param {string} name
   * @param {number} defaultPrice
   * @param {ArrayBuffer} imageSrc
   * @param {string} description
   * @param {number} brandFk
   * @param {object} brand
   * @param {Array} categories
   * @param {Array} discount
   * @param {Array} discounts
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
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
    createdAt,
    updatedAt,
    deletedAt,
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
    this.deletedAt = deletedAt;
    this.categories = categories;
    this.discounts = discounts;
  }
};
