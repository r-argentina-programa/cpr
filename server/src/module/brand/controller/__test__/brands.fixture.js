const Brand = require('../../entity/Brand');

module.exports = function createTestBrand(id) {
  return new Brand({
    id,
    name: 'coca-cola',
    logo: '/public/uploads/test.jpg',
  });
};
