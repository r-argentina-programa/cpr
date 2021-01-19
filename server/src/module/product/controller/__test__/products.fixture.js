const Product = require('../../entity/entity');

module.exports = function createTestProduct(id, brandFk = '3') {
  return new Product({
    id,
    name: 'coca-cola',
    defaultPrice: '300',
    description: 'product description',
    brandFk,
    imageSrc: '/public/uploads/test.jpg',
  });
};
