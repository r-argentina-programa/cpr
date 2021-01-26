const idsQuantityMap = new Map();
function calculateCartPrice(idsAndQuantity, products) {
  const usedDiscounts = new Map();
  idsAndQuantity.forEach(({ id, quantity }) => {
    idsQuantityMap.set(id, quantity);
  });

  let bestPrice = products.reduce((acum, current) => {
    const quantity = idsQuantityMap.get(current.id);
    const currentDiscounts = [];
    for (let i = 0; i < quantity; i++) {
      currentDiscounts.push(current.discount);
    }
    usedDiscounts.set(current.id, currentDiscounts);
    let price;
    if (current.discount) {
      price = current.discount.finalPrice;
    } else {
      price = current.defaultPrice;
    }
    return acum + price * quantity;
  }, 0);

  console.log(bestPrice);

  products.forEach((product) => {
    product.discounts = getProfit(product);
    product.discounts = product.discounts.sort((a, b) => a.profit - b.profit);
  });

  console.log(bestPrice);
  products.forEach((product) => {
    let currentDiscounts = [...usedDiscounts.get(product.id)];
    let i = 0;
    product.discounts.forEach((discount) => {
      const replacedDiscounts = replaceDiscounts(discount, currentDiscounts, i, product.id);
      currentDiscounts = replacedDiscounts.discounts;
      i = replacedDiscounts.i;
    });
    const currentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    if (currentPrice < bestPrice) {
      usedDiscounts.set(product.id, currentDiscounts);
    }
  });

  console.log('FG', bestPrice);

  bestPrice = 0;
  products.forEach((product) => {
    const discounts = usedDiscounts.get(product.id);
    bestPrice += discounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
  });

  console.log(bestPrice);
  console.log(usedDiscounts);
  return bestPrice;
}

function getProfit(product) {
  return product.discounts.map((discount) => {
    const { type, value } = discount;
    switch (type) {
      case 'BuyXpayY': {
        let [x, y] = value.split('x');
        x = Number(x);
        y = Number(y);
        discount.profit = y / x;
        break;
      }
      default:
        break;
    }
    return discount;
  });
}

function replaceDiscounts(discount, discounts, i, id) {
  const { type, value } = discount;
  switch (type) {
    case 'BuyXpayY': {
      let [x, y] = value.split('x');
      x = Number(x);
      y = Number(y);
      let productQuantity = idsQuantityMap.get(id);
      const free = parseInt(productQuantity / x);
      let aux = 0;
      for (let j = 0; j < x * free; j++) {
        if (aux < y) {
          discounts[i] = discount;
        } else {
          discounts[i] = { ...discount, finalPrice: 0 };
        }
        if (aux === x) {
          aux = 0;
        }
        aux++;
        i++;
      }
      idsQuantityMap.set(id, productQuantity - x * free);
      break;
    }
    default:
      break;
  }
  return { discounts, i };
}

module.exports = {
  calculateCartPrice,
};
