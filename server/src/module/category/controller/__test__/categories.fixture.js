const Category = require('../../entity/Category');

module.exports = function createTestCategory(id, discounts = [], name = 'electronics') {
  return new Category({
    id,
    name,
    discounts,
  });
};
