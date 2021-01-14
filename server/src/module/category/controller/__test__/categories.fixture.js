const Category = require('../../entity/category');

module.exports = function createTestCategory(id) {
  return new Category({
    id,
    name: 'electronics',
  });
};
