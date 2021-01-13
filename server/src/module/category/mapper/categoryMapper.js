const Category = require('../entity/Category');

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
  return new Category(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
