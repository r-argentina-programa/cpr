const Discount = require('../entity/Discount');

function fromDataToEntity({
  id,
  'fk-discount-type': fkDiscountType,
  value,
  'discount-from': discountFrom,
  'discount-to': discountTo,
}) {
  return new Discount({
    id,
    fkDiscountType,
    value,
    discountFrom,
    discountTo,
  });
}

function fromModelToEntity(model) {
  return new Discount(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
