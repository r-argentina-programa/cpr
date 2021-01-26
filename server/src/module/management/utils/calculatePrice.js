function calculatePrice(discount, defaultPrice) {
  let finalPrice = defaultPrice;
  let { type, value } = discount;
  value = Number(value);
  switch (type) {
    case 'Fixed': {
      finalPrice = defaultPrice - value;
      break;
    }
    case 'Percentage': {
      finalPrice = defaultPrice - defaultPrice * (value / 100);
      break;
    }
    case 'BuyXpayY': {
      finalPrice = defaultPrice;
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
