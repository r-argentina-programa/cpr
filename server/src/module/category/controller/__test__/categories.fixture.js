const Category = require('../../entity/Category');

module.exports = function createTestCategory(id) {
  return new Category({
    id,
    name: 'electronics',
    discounts: [],
  });
};
