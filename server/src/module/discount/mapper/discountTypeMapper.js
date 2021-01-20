const DiscountType = require('../entity/discountType');

function fromDataToEntity({ id, type }) {
  return new DiscountType({
    id,
    type,
  });
}

function fromModelToEntity(model) {
  return new DiscountType(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
