const Brand = require('../../entity/Brand');

module.exports = function createTestBrand(id, name = 'coca-cola') {
  return new Brand({
    id,
    name,
    logo: '/public/uploads/test.jpg',
    discounts: [],
  });
};
