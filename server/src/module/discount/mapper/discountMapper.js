const Discount = require('../entity/Discount');

function fromDataToEntity({ id, type, value }) {
  return new Discount({
    id,
    type,
    value,
  });
}

function fromModelToEntity(model) {
  return new Discount(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
