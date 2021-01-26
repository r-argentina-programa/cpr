const Product = require('../../entity/entity');

module.exports = function createTestProduct(id, defaultPrice = '300', brandFk = '3') {
  return new Product({
    id,
    name: 'coca-cola',
    defaultPrice,
    description: 'product description',
    brandFk,
    imageSrc: '/public/uploads/test.jpg',
  });
};
