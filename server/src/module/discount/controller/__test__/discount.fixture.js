const Discount = require('../../entity/Discount');

module.exports = function createTestDiscount(id, type = 'Fixed') {
  return new Discount({
    id,
    type,
    value: '50',
  });
};
