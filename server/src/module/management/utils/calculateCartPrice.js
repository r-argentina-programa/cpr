function calculateCartPrice(idsAndQuantity, products) {
  const idsQuantityMap = new Map();
  const finalDiscounts = [];
  const discountsPerProduct = {};

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
    discountsPerProduct[current.id] = { discounts: [], finalPrice: price * quantity };
    return acum + price * quantity;
  }, 0);

  setDiscountsProfit(products, idsQuantityMap);

  products.forEach((product) => {
    let currentDiscounts = [...usedDiscounts.get(product.id)];
    const bestCurrentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    const newDiscounts = [];
    let finalPrice = bestCurrentPrice;
    let i = 0;

    let p = product;
    let productQuantity = idsQuantityMap.get(product.id);
    while (p.discounts[0] && productQuantity > 0) {
      const discount = product.discounts.shift();
      const replacedDiscounts = replaceDiscounts(
        discount,
        currentDiscounts,
        i,
        product.id,
        idsQuantityMap,
        newDiscounts
      );
      currentDiscounts = replacedDiscounts.discounts;
      p = setProductDiscountsProfit(product, idsQuantityMap);

      const currentPrice = currentDiscounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
      if (currentPrice < bestCurrentPrice) {
        usedDiscounts.set(product.id, currentDiscounts);
        finalPrice = currentPrice;
        i = replacedDiscounts.i;
        discountsPerProduct[product.id] = { discounts: newDiscounts, finalPrice };
      } else {
        idsQuantityMap.set(product.id, productQuantity);
      }
      productQuantity = idsQuantityMap.get(product.id);
    }
  });

  bestPrice = 0;
  products.forEach((product) => {
    const discounts = usedDiscounts.get(product.id);
    if (discountsPerProduct[product.id].discounts.length) {
      finalDiscounts.push(...discountsPerProduct[product.id].discounts);
    }
    bestPrice += discounts.reduce((acum, curr) => acum + curr.finalPrice, 0);
    const remainingProducts = idsQuantityMap.get(product.id);
    if (product.discount && remainingProducts) {
      if (product.discount.discount_products) {
        for (let j = 0; j < remainingProducts; j++) {
          finalDiscounts.push(product.discount);
          discountsPerProduct[product.id].discounts.push(product.discount);
        }
      } else {
        if (!finalDiscounts.find((discount) => discount.id === product.discount.id)) {
          finalDiscounts.push(product.discount);
        }
        discountsPerProduct[product.id].discounts.push(product.discount);
      }
    }
  });

  return { bestPrice, discountsPerProduct, finalDiscounts };
}

const getProductDefaultBestProfit = (product) => {
  let productBestProfit;
  if (product.discount) {
    if (product.discount.type === 'Percentage') {
      productBestProfit = (100 - product.discount.value) / 100;
    } else if (product.discount.type === 'Fixed') {
      productBestProfit = (product.defaultPrice - product.discount.value) / 100;
    }
  } else {
    productBestProfit = 1;
  }
  return productBestProfit;
};

const setDiscountsProfit = (products, idsQuantityMap) => {
  products.forEach((product) => {
    const quantity = idsQuantityMap.get(product.id);
    const productBestProfit = getProductDefaultBestProfit(product);
    product.discounts = getProfit(product, quantity, productBestProfit);
    product.discounts = product.discounts.sort((a, b) => a.profit - b.profit);
  });
};

const setProductDiscountsProfit = (p, idsQuantityMap) => {
  const quantity = idsQuantityMap.get(p.id);
  const product = p;
  const productBestProfit = getProductDefaultBestProfit(product);
  product.discounts = getProfit(product, quantity, productBestProfit);
  product.discounts = product.discounts.sort((a, b) => a.profit - b.profit);
  return product;
};

// Profit the lower the better
function getProfit(product, quantity, productBestProfit = 1) {
  return product.discounts.map((discount) => {
    const { type, value } = discount;
    switch (type) {
      case 'BuyXpayY': {
        let [x, y] = value.split('x');
        x = Number(x);
        y = Number(y);
        discount.profit = ((quantity % x) * productBestProfit + (quantity / x) * y) / quantity;
        break;
      }
      case 'BuyXgetYthWithZOff': {
        let [x, y, z] = value.split(/[x=]/gi);
        x = Number(x);
        y = Number(y);
        const [zValue, zType] = z.split(/(?=[%$])/);
        if (zType === '$') {
          discount.profit =
            ((quantity % y) * productBestProfit +
              quantity / y +
              (product.defaultPrice - zValue) / 100) /
            quantity;
        } else {
          discount.profit =
            ((quantity % y) * productBestProfit + quantity / y + (100 - zValue) / 100) / quantity;
        }
        break;
      }
      default:
        break;
    }
    return discount;
  });
}

function replaceDiscounts(discount, discounts, i, id, idsQuantityMap, finalDiscounts) {
  const { type, value } = discount;
  switch (type) {
    case 'BuyXpayY': {
      let [x, y] = value.split('x');
      x = Number(x);
      y = Number(y);
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
        if (aux === x) {
          aux = 0;
        }
        i++;
      }
      idsQuantityMap.set(id, productQuantity - x * free);

      for (let j = 0; j < free; j++) {
        finalDiscounts.push(discount);
      }

      break;
    }
    case 'BuyXgetYthWithZOff': {
      let [x, y, z] = value.split(/[x=]/gi);
      x = Number(x);
      y = Number(y);
      const [zValue, zType] = z.split(/(?=[%$])/);
      const productQuantity = idsQuantityMap.get(id);
      const used = parseInt(productQuantity / y, 10);
      let aux = 0;
      const n = used * y;
      for (let j = 0; j < n; j++) {
        aux++;
        if (aux < y) {
          discounts[i] = discount;
        } else {
          if (zType === '$') {
            discounts[i] = { ...discount, finalPrice: discount.finalPrice - zValue };
          } else {
            discounts[i] = {
              ...discount,
              finalPrice: discount.finalPrice * ((100 - zValue) / 100),
            };
          }
          aux = 0;
        }
        i++;
      }
      idsQuantityMap.set(id, productQuantity - n);

      for (let j = 0; j < used; j++) {
        finalDiscounts.push(discount);
      }

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
