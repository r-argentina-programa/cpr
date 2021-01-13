const Product = require('../entity/entity');

function fromDataToEntity({ id, name, defaultPrice, imageSrc, description, brand_fk }) {
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
  return new Product(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
