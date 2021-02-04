const createTestDiscount = require('../../../discount/controller/__test__/discount.fixture');
const createTestProduct = require('../../../product/controller/__test__/products.fixture');
const { calculateCartPrice } = require('../calculateCartPrice');

describe('calculateCartPrice function', () => {
  test('calculate correct final price when discount is Fixed type', async () => {
    const productsIdsAndQuantity = [{ id: 1, quantity: 2 }];
    const products = [
      {
        id: 1,
        name: 'Coca-Cola',
        defaultPrice: 400,
        discount: {
          id: 1,
          type: 'Fixed',
          value: '50',
          updatedAt: '2021-02-03T20:54:04.752Z',
          createdAt: '2021-02-03T20:54:04.752Z',
          discount_products: {
            createdAt: '2021-02-03T20:54:36.949Z',
            updatedAt: '2021-02-03T20:54:36.949Z',
            product_id: 1,
            DiscountId: 1,
          },
          finalPrice: 350,
        },
        imageSrc: { type: 'Buffer', data: [] },
        description: 'A coca-cola',
        brandFk: 2,
        brand: {
          id: 2,
          name: 'The coca-cola company',
          logo: { type: 'Buffer', data: [] },
          updatedAt: '2021-02-03T17:13:29.878Z',
          createdAt: '2021-02-03T17:13:29.879Z',
          discounts: [],
        },
        createdAt: '2021-02-03T20:14:13.700Z',
        updatedAt: '2021-02-03T20:14:13.700Z',
        categories: [],
        discounts: [
          {
            id: 1,
            type: 'Fixed',
            value: '50',
            updatedAt: '2021-02-03T20:54:04.752Z',
            createdAt: '2021-02-03T20:54:04.752Z',
            discount_products: {
              createdAt: '2021-02-03T20:54:36.949Z',
              updatedAt: '2021-02-03T20:54:36.949Z',
              product_id: 1,
              DiscountId: 1,
            },
            finalPrice: 350,
          },
        ],
      },
    ];

    const response = calculateCartPrice(productsIdsAndQuantity, products);
    expect(response.finalDiscounts[0].finalPrice).toEqual(350);
    expect(response.discountsPerProduct['1'].finalPrice).toEqual(700);
  });

  test('calculate correct final price when discount is Porcentage type', async () => {
    const productsIdsAndQuantity = [{ id: 2, quantity: 2 }];
    const products = [
      {
        id: 2,
        name: 'Sprite',
        defaultPrice: 400,
        discount: {
          id: 2,
          type: 'Percentage',
          value: '50',
          updatedAt: '2021-02-03T20:54:22.889Z',
          createdAt: '2021-02-03T20:54:22.889Z',
          discount_products: {
            createdAt: '2021-02-03T21:06:45.470Z',
            updatedAt: '2021-02-03T21:06:45.470Z',
            product_id: 2,
            DiscountId: 2,
          },
          finalPrice: 200,
        },
        imageSrc: { type: 'Buffer', data: [] },
        description: 'A sprite',
        brandFk: 2,
        brand: {
          id: 2,
          name: 'The coca-cola company',
          logo: { type: 'Buffer', data: [] },
          updatedAt: '2021-02-03T17:13:29.878Z',
          createdAt: '2021-02-03T17:13:29.879Z',
          discounts: [],
        },
        createdAt: '2021-02-03T20:14:30.315Z',
        updatedAt: '2021-02-03T20:14:30.315Z',
        categories: [],
        discounts: [
          {
            id: 2,
            type: 'Percentage',
            value: '50',
            updatedAt: '2021-02-03T20:54:22.889Z',
            createdAt: '2021-02-03T20:54:22.889Z',
            discount_products: {
              createdAt: '2021-02-03T21:06:45.470Z',
              updatedAt: '2021-02-03T21:06:45.470Z',
              product_id: 2,
              DiscountId: 2,
            },
            finalPrice: 200,
          },
        ],
      },
    ];

    const response = calculateCartPrice(productsIdsAndQuantity, products);
    expect(response.finalDiscounts[0].finalPrice).toEqual(200);
    expect(response.discountsPerProduct['2'].finalPrice).toEqual(400);
  });

  test('calculate correct final price when discount is BuyXpayY type', async () => {
    const productsIdsAndQuantity = [{ id: 3, quantity: 3 }];
    const products = [
      {
        id: 3,
        name: 'Pepsi',
        defaultPrice: 400,
        discount: 0,
        imageSrc: { type: 'Buffer', data: [] },
        description: 'A pepsi',
        brandFk: 2,
        brand: {
          id: 2,
          name: 'Pepsico',
          logo: { type: 'Buffer', data: [] },
          updatedAt: '2021-02-03T17:13:29.878Z',
          createdAt: '2021-02-03T17:13:29.879Z',
          discounts: [],
        },
        createdAt: '2021-02-04T03:24:24.599Z',
        updatedAt: '2021-02-04T03:24:24.599Z',
        categories: [],
        discounts: [
          {
            id: 3,
            type: 'BuyXpayY',
            value: '3x2',
            updatedAt: '2021-02-04T03:23:42.374Z',
            createdAt: '2021-02-04T03:23:42.374Z',
            discount_products: {
              createdAt: '2021-02-04T03:24:24.654Z',
              updatedAt: '2021-02-04T03:24:24.654Z',
              product_id: 3,
              DiscountId: 3,
            },
            finalPrice: 400,
          },
        ],
      },
    ];

    const response = calculateCartPrice(productsIdsAndQuantity, products);
    expect(response.finalDiscounts[0].profit).toEqual(0.6666666666666666);
    expect(response.discountsPerProduct['3'].finalPrice).toEqual(800);
  });

  test('calculate correct final price when discount is BuyXgetYthWithZOff type', async () => {
    const productsIdsAndQuantity = [{ id: 4, quantity: 3 }];
    const products = [
      {
        id: 4,
        name: 'Fanta',
        defaultPrice: 400,
        discount: 0,
        imageSrc: { type: 'Buffer', data: [] },
        description: 'A fanta',
        brandFk: 2,
        brand: {
          id: 2,
          name: 'The coca-cola company',
          logo: { type: 'Buffer', data: [] },
          updatedAt: '2021-02-03T17:13:29.878Z',
          createdAt: '2021-02-03T17:13:29.879Z',
          discounts: [],
        },
        createdAt: '2021-02-04T03:59:12.417Z',
        updatedAt: '2021-02-04T03:59:12.417Z',
        categories: [],
        discounts: [
          {
            id: 4,
            type: 'BuyXgetYthWithZOff',
            value: '2x3=80',
            updatedAt: '2021-02-04T03:58:36.820Z',
            createdAt: '2021-02-04T03:58:36.820Z',
            discount_products: {
              createdAt: '2021-02-04T03:59:12.467Z',
              updatedAt: '2021-02-04T03:59:12.467Z',
              product_id: 4,
              DiscountId: 4,
            },
            finalPrice: 400,
          },
        ],
      },
    ];

    const response = calculateCartPrice(productsIdsAndQuantity, products);
    expect(response.finalDiscounts[0].profit).toEqual(0.7333333333333334);
    expect(response.discountsPerProduct['4'].finalPrice).toEqual(880);
  });
});
