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
    const bestCurrentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    let i = 0;
    product.discounts.forEach((discount) => {
      const replacedDiscounts = replaceDiscounts(discount, currentDiscounts, i, product.id);
      currentDiscounts = replacedDiscounts.discounts;
      i = replacedDiscounts.i;
    });
    const currentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    console.log(currentPrice, bestCurrentPrice, product.id);
    if (currentPrice < bestCurrentPrice) {
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

//Profit the lower the better
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
        // 1x2=80  => 2x1*(100-80)  worse than 2x1 //
        // $100
        //  1x2 = 80 => 100+20 => 120
        // 1/2 => 0.5 + (100-80=20)/100 => 0.2
        //final profit => 0.7
        // profit of 2x1 => 0.5 , profit of 3x2 => 0.66
        //is better 3x2 than 1x2=80? NO
        //buying 6 you pay 4 => 400
        //Buying 6 you pay 3 full and 3 with 80%off => 300+60 => 360
        //1x2=80 => ((1)+(0.2))/2=> 0.6 0.6<0.66 hence 1x2 is better than 3x2
        let [x, y, z] = value.split(/[x=]/gi);
        x = Number(x);
        y = Number(y);
        z = Number(z);
        discount.profit = (x + (100 - z) / 100) / y;
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
