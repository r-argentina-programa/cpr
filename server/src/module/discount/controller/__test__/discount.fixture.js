const Discount = require('../../entity/Discount');
module.exports = function createTestDiscount(id) {
  return new Discount({
    id,
    type: 'fixed',
    value: '50',
  });
};
