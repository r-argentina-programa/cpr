const Category = require('../entity/Category');
const { calculatePrice } = require('../../management/utils/calculatePrice');

function fromDataToEntity({ id, name }) {
  return new Category({
    id,
    name,
  });
}

/**
 * @param {import('./categoryModel')} model
 * @returns {import('../entity/Category')}
 */
function fromModelToEntity(model) {
  const modelJson = model.toJSON();
  modelJson.discounts = modelJson.discounts || [];
  modelJson.discounts = modelJson.discounts.map((discount) =>
    calculatePrice(discount, modelJson.defaultPrice)
  );
  modelJson.discounts.sort((a, b) => a.finalPrice - b.finalPrice);
  return new Category(modelJson);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
