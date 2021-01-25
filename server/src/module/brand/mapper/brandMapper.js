const Brand = require('../entity/Brand');
const { calculatePrice } = require('../../management/utils/calculatePrice');

function fromDataToEntity({ id, name, logo }) {
  return new Brand({
    id,
    name,
    logo,
  });
}

function fromModelToEntity(model) {
  const modelJson = model.toJSON();
  modelJson.discounts = modelJson.discounts || [];
  modelJson.discounts = modelJson.discounts.map((discount) =>
    calculatePrice(discount, modelJson.defaultPrice)
  );
  modelJson.discounts.sort((a, b) => a.finalPrice - b.finalPrice);
  return new Brand(modelJson);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
