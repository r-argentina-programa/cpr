const Brand = require('../entity/Brand');

function fromDataToEntity({ id, name, logo }) {
  return new Brand({
    id,
    name,
    logo,
  });
}

function fromModelToEntity(model) {
  return new Brand(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
