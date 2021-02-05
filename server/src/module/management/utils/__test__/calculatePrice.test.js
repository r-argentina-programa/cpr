const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');
const createTestProduct = require('../../../product/controller/__test__/products.fixture');
const { calculatePrice } = require('../calculatePrice');

describe('calculatePrice function', () => {
  test('calculate correct final price when discount type is Fixed', async () => {
    const discount = createTestDiscount(undefined, 'Fixed');
    const product = createTestProduct(undefined, 300);

    const finalPrice = calculatePrice(discount, product.defaultPrice);
    expect(product.defaultPrice).toEqual(300);
    expect(finalPrice.type).toEqual('Fixed');
    expect(finalPrice.value).toEqual('50');
    expect(finalPrice.finalPrice).toEqual(250);
  });

  test('calculate correct final price when discount type is Percentage', async () => {
    const discount = createTestDiscount(undefined, 'Percentage');
    const product = createTestProduct(undefined, 300);

    const finalPrice = calculatePrice(discount, product.defaultPrice);
    expect(product.defaultPrice).toEqual(300);
    expect(finalPrice.type).toEqual('Percentage');
    expect(finalPrice.value).toEqual('50');
    expect(finalPrice.finalPrice).toEqual(150);
  });

  test('calculate correct default final price when discount type is Other', async () => {
    const discount = createTestDiscount(undefined, 'Other');
    const product = createTestProduct(undefined, 300);

    const finalPrice = calculatePrice(discount, product.defaultPrice);
    expect(product.defaultPrice).toEqual(300);
    expect(finalPrice.type).toEqual('Other');
    expect(finalPrice.value).toEqual('50');
    expect(finalPrice.finalPrice).toEqual(300);
  });
});
