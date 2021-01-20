module.exports = class Discount {
  constructor({
    id,
    fkDiscountType,
    value,
    discountFrom,
    discountTo,
    updatedAt,
    createdAt,
    deletedAt,
  }) {
    this.id = id;
    this.fkDiscountType = fkDiscountType;
    this.value = value;
    this.discountFrom = discountFrom;
    this.discountTo = discountTo;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }
};
