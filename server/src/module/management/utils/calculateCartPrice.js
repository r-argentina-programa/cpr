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
      currentDiscounts.push(current.discount || { finalPrice: current.defaultPrice });
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

  console.log('initial Best Price', bestPrice);

  products.forEach((product) => {
    product.discounts = getProfit(product);
    product.discounts = product.discounts.sort((a, b) => a.profit - b.profit);
  });

  products.forEach((product) => {
    let currentDiscounts = [...usedDiscounts.get(product.id)];
    const bestCurrentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    let i = 0;
    product.discounts.forEach((discount) => {
      const replacedDiscounts = replaceDiscounts(discount, currentDiscounts, i, product.id);
      currentDiscounts = replacedDiscounts.discounts;
      i = replacedDiscounts.i;
    });
    const currentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    if (currentPrice < bestCurrentPrice) {
      usedDiscounts.set(product.id, currentDiscounts);
    }
  });

  bestPrice = 0;
  products.forEach((product) => {
    const discounts = usedDiscounts.get(product.id);
    bestPrice += discounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
  });

  console.log('final Best Price', bestPrice);
  console.log(usedDiscounts);
  return bestPrice;
}

// Profit the lower the better
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
      case 'BuyXgetYthWithZOff': {
        let [x, y, z] = value.split(/[x=]/gi);
        x = Number(x);
        y = Number(y);
        z = Number(z);
        discount.profit = (x + (100 - z) / 100) / y;
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
      x = Number(x); // 3
      y = Number(y); // 1 /// 3x1
      const productQuantity = idsQuantityMap.get(id);
      const free = parseInt(productQuantity / x, 10);
      const freeQuantity = x - y;
      let aux = 0;
      for (let j = 0; j < x * free; j++) {
        aux++;
        if (aux <= freeQuantity) {
          discounts[i] = { ...discount, finalPrice: 0 };
        } else {
          discounts[i] = discount;
        }
        if (aux == x) {
          aux = 0;
        }
        i++;
      }
      idsQuantityMap.set(id, productQuantity - x * free);
      break;
    }
    case 'BuyXgetYthWithZOff': {
      let [x, y, z] = value.split(/[x=]/gi);
      x = Number(x);
      y = Number(y);
      z = Number(z);
      const productQuantity = idsQuantityMap.get(id);
      const used = parseInt(productQuantity / y, 10);
      let aux = 0;
      const n = used * y;
      for (let j = 0; j < n; j++) {
        aux++;
        if (aux < y) {
          discounts[i] = discount;
        } else {
          discounts[i] = { ...discount, finalPrice: discount.finalPrice * ((100 - z) / 100) };
          aux = 0;
        }
        i++;
      }
      idsQuantityMap.set(id, productQuantity - n);
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
