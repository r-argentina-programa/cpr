const Category = require('../../entity/Category');

module.exports = function createTestCategory(id, discounts = []) {
  return new Category({
    id,
    name: 'electronics',
    discounts,
  });
};
