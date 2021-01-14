const Product = require('../../entity/entity');

module.exports = function createTestProduct(id) {
  return new Product({
    id,
    name: 'coca-cola',
    defaultPrice: '300',
    description: 'product description',
    brandFk: '3',
    imageSrc: '/public/uploads/test.jpg',
  });
};
