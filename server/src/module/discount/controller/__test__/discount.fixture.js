const Discount = require('../../entity/Discount');
module.exports = function createTestDiscount(id) {
  return new Discount({
    id,
    type: 'Fixed',
    value: '50',
  });
};
