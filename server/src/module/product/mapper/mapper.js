const Product = require('../entity/entity');
const { calculatePrice } = require('../../management/utils/calculatePrice');

function fromDataToEntity({ id, name, defaultPrice, imageSrc, description, brand_fk, categories }) {
  categories = categories ? JSON.parse(categories) : [];
  return new Product({
    id,
    name,
    defaultPrice,
    imageSrc,
    description,
    brandFk: brand_fk,
  });
}

/**
 * @param {import('./clubModel')} model
 * @returns {import('../../entity/club')}
 */
function fromModelToEntity(model) {
  const modelJson = model.toJSON();
  modelJson.discounts = modelJson.discounts || [];
  modelJson.discounts = modelJson.discounts.map((discount) =>
    calculatePrice(discount, modelJson.defaultPrice)
  );
  modelJson.discounts.sort((a, b) => a.finalPrice - b.finalPrice);
  modelJson.discount = modelJson.discounts[0] || 0;
  modelJson.brand = modelJson.Brand;
  return new Product(modelJson);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
