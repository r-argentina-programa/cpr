const Brand = require('../entity/Brand');

function fromDataToEntity({
    id,
    name,
}) {
    return new Brand({
        id,
        name,
    })
}

function fromModelToEntity(model) {
    return new Brand(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
}
