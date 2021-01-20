function calculatePrice(discount, defaultPrice) {
  let finalPrice = defaultPrice;
  const { type, value } = discount;
  switch (type) {
    case 'Fixed': {
      finalPrice = defaultPrice - value;
      break;
    }
    case 'Percentage': {
      finalPrice = defaultPrice - defaultPrice * (value / 100);
      break;
    }
    default:
      break;
  }
  return { ...discount, finalPrice };
}

module.exports = {
  calculatePrice,
};
