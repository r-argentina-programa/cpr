/// <reference types="cypress" />

const productMockId = 4;
const brandMockId = 1;

describe('<Main/>', () => {
  beforeEach(() => {
    cy.fixture('allCategories').as('categories');
    cy.fixture('allBrands').as('brands');
    cy.fixture('allProducts').as('products');

    cy.intercept('/api/categories/all', { fixture: 'allCategories' });
    cy.intercept('/api/brands/all', { fixture: 'allBrands' });

    cy.intercept('/api/products/numberOfProducts/?page=1', {
      fixture: 'numberOfProducts',
    });
  });

  it('Mocks data and displays it', () => {
    cy.intercept('/api/products/filter/?page=1', {
      fixture: 'allProducts',
    }).as('productsMock');
    cy.visit('/');
    cy.wait('@productsMock').then((productsMock) => {
      cy.get('[data-cy=filter-brands]').should('be.visible').click();
      cy.get('[data-cy=brand-item]').should('be.visible');
      cy.get('@brands').then((brands) => {
        cy.get('[data-cy=brand-item]').should('have.length', brands.length);
        brands.forEach((brand) => {
          cy.get('[data-cy=brand-item]').contains(brand.name);
        });
      });

      cy.get('[data-cy=filter-categories]').should('be.visible').click();
      cy.get('[data-cy=category-item]').should('be.visible');

      cy.get('@categories').then((categories) => {
        cy.get('[data-cy=category-item]').should('have.length', categories.length);
        categories.forEach((category) => {
          cy.get('[data-cy=category-item]').contains(category.name);
        });
      });

      cy.get('#min-price').should('have.value', 0);
      cy.get('#max-price').should('have.value', 0);

      cy.get('@products').then((products) => {
        cy.get('[data-cy=product-card]').should('have.length', products.length);
        products.forEach((product) => {
          cy.get('[data-cy=product-card]').contains(product.name);
          cy.get('[data-cy=product-card]').contains(product.defaultPrice);
        });
        cy.get('[data-cy=product-card]').find('img').should('not.have.attr', 'src', '');
      });

      cy.get('h1.title').should('be.visible');
      cy.get('[data-cy=pagination-container]').should('not.have.length', 4);
      cy.get('.card').should('be.visible').as('product');
      cy.get('@product').children();
    });
  });

  it('Renders main elements ', () => {
    cy.intercept('/api/products/filter/?page=1', {
      body: [],
    });
    cy.visit('/');
    cy.get('[data-cy=header-title]').should('have.text', 'Market').should('be.visible');
    cy.get('[data-cy=header-brand]').should('have.text', 'Brands').should('be.visible');
    cy.get('[data-cy=header-cart]').should('be.visible');
    cy.get('[data-cy=filter-brands]').should('have.text', 'Brands').should('be.visible');
    cy.get('[data-cy=filter-categories]').should('have.text', 'Categories').should('be.visible');
    cy.get('[data-cy=filter-price]').should('have.text', 'Price').should('be.visible');
  });

  it('Shows error if term do not match ', () => {
    const errorTerm = 'asdsadsadsajdsadsakdk';
    cy.intercept('/api/products/filter/?page=1', {
      body: [],
    });
    cy.intercept(`/api/search/${errorTerm}`, { body: [] });

    cy.visit('/');

    cy.get('[data-cy="error-message"]').should('not.exist');

    cy.get('input#Search').type(errorTerm);

    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .contains("We couldn't find any results for this term");

    cy.get('[data-cy="search-container-error-message"]')
      .should('be.visible')
      .contains('No products found');
  });

  it('Should show discount price if product has discount or default price if not', () => {
    cy.intercept('/api/products/filter/?page=1', {
      fixture: 'allProducts',
    });
    cy.visit('/');
    cy.get('@products').then((products) => {
      cy.get('[data-cy=product-card]').should('have.length', products.length);
      products.forEach((product) => {
        cy.get('[data-cy=product-card]').contains(product.name);
        if (product.discount) {
          cy.get('[data-cy=product-card]')
            .contains(product.defaultPrice)
            .and('have.css', 'text-decoration', 'line-through solid rgb(87, 87, 87)');
          cy.get('[data-cy=product-card]').contains(product.discount.finalPrice);
        } else {
          cy.get('[data-cy=product-card]')
            .contains(product.defaultPrice)
            .and('have.css', 'text-decoration', 'none solid rgb(87, 87, 87)');
        }
        cy.get('[data-cy=product-card]').find('img').should('not.have.attr', 'src', '');
      });
    });
  });
});

describe('ProductDetails', () => {
  before(() => {
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.fixture('allCategories').as('categories');
    cy.fixture('allBrands').as('brands');
    cy.fixture('allProducts').as('products');

    cy.intercept('/api/categories/all', { fixture: 'allCategories' });
    cy.intercept('/api/brands/all', { fixture: 'allBrands' });
  });

  it('Should display product details', () => {
    cy.fixture('product').as('product');
    cy.intercept('/api/products/numberOfProducts/?page=1', {
      fixture: 'numberOfProducts',
    }).as('numberOfProductsMock');

    cy.intercept('/api/products/filter/?page=1', {
      fixture: 'allProducts',
    }).as('productsMock');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit('/');
    cy.wait(['@productsMock']).then(() => {
      cy.get('@product').then((product) => {
        cy.get(`a[href*="/product/${product.id}"]`).click();
        cy.url().should('include', `/product/${product.id}`);
        cy.wait(['@productMock']);
        cy.get('[data-cy=product-description]')
          .should('contain', product.name)
          .and('contain', product.description)
          .and('contain', product.brand.name);

        cy.get('[data-cy=default-price]')
          .should('contain', product.defaultPrice)
          .and('have.css', 'text-decoration', 'line-through solid rgb(67, 71, 77)');
        cy.get('[data-cy=discount-price]')
          .should('contain', product.discount.finalPrice)
          .and('have.css', 'text-decoration', 'none solid rgb(255, 0, 0)');
      });
    });
  });

  it('should add product to cart and then remove it', () => {
    cy.fixture('product').as('product');
    cy.intercept(`/api/brand/3/viewProducts`, {
      body: [],
    }).as('productsWithSameBrand');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      body: [],
    }).as('relatedProducts');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit(`/product/${productMockId}`);
    cy.wait(['@productMock', '@relatedProducts', '@productsWithSameBrand']);
    cy.get('[data-cy=cart-length]').should('contain', '0');
    cy.get('@product').then((product) => {
      cy.get('[data-cy=add-product-to-cart-button]')
        .click()
        .should(() => {
          expect(localStorage.getItem('cart')).to.eq(JSON.stringify([product]));
        });
      cy.get('[data-cy=status-container]').should(
        'contain',
        `${product.name} has been successfully added to the cart.`
      );

      cy.get('[data-cy=cart-length]').should('contain', '1');

      cy.get('[data-cy=add-product-to-cart-button]').click();
      cy.get('[data-cy=status-container]').should(
        'contain',
        `${product.name} is already in your Cart!`
      );
    });
  });

  it('should display product discounts', () => {
    cy.fixture('product').as('product');
    cy.fixture('relatedProducts').as('relatedProducts');
    cy.intercept(`/api/brand/3/viewProducts`, {
      body: [],
    }).as('productsWithSameBrandMock');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      body: [],
    }).as('relatedProductsMock');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit(`/product/${productMockId}`);
    cy.wait(['@productMock', '@relatedProductsMock', '@productsWithSameBrandMock']);
    cy.get('@product').then((product) => {
      product.discounts.forEach((discount) => {
        cy.get('[data-cy=product-discounts-container]')
          .should('contain', discount.type)
          .and('contain', discount.value)
          .and('contain', discount.finalPrice);
      });
    });
  });

  it('should display related products', () => {
    cy.fixture('product').as('product');
    cy.fixture('relatedProducts').as('relatedProducts');
    cy.intercept(`/api/brand/3/viewProducts`, {
      body: [],
    }).as('productsWithSameBrandMock');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      fixture: 'relatedProducts',
    }).as('relatedProductsMock');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit(`/product/${productMockId}`);
    cy.wait(['@productMock', '@relatedProductsMock', '@productsWithSameBrandMock']);
    cy.get('@relatedProducts').then((relatedProducts) => {
      cy.get('[data-cy=related-products-container]')
        .children()
        .should('have.length', relatedProducts.length);
    });
  });

  it('should display products with same brand', () => {
    cy.fixture('product').as('product');
    cy.fixture('productsWithSameBrand').as('productsWithSameBrand');
    cy.intercept(`/api/brand/3/viewProducts`, {
      fixture: 'productsWithSameBrand',
    }).as('productsWithSameBrandMock');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      body: [],
    }).as('relatedProductsMock');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit(`/product/${productMockId}`);
    cy.wait(['@productMock', '@relatedProductsMock', '@productsWithSameBrandMock']);
    cy.get('@productsWithSameBrand').then((productsWithSameBrand) => {
      cy.get('[data-cy=products-with-same-brand-container]')
        .children()
        .should('have.length', productsWithSameBrand.length);
    });
  });

  it('should display products with same brand and related products', () => {
    cy.fixture('product').as('product');
    cy.fixture('relatedProducts').as('relatedProducts');
    cy.fixture('productsWithSameBrand').as('productsWithSameBrand');
    cy.intercept(`/api/brand/3/viewProducts`, {
      fixture: 'productsWithSameBrand',
    }).as('productsWithSameBrandMock');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      fixture: 'relatedProducts',
    }).as('relatedProductsMock');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.visit(`/product/${productMockId}`);
    cy.wait(['@productMock', '@relatedProductsMock', '@productsWithSameBrandMock']);
    cy.get('@relatedProducts').then((relatedProducts) => {
      cy.get('[data-cy=related-products-container]')
        .children()
        .should('have.length', relatedProducts.length);
    });

    cy.get('@productsWithSameBrand').then((productsWithSameBrand) => {
      cy.get('[data-cy=products-with-same-brand-container]')
        .children()
        .should('have.length', productsWithSameBrand.length);
    });
  });
});

describe('Brands', () => {
  beforeEach(() => {
    cy.fixture('allBrands').as('brands');
    cy.intercept('/api/brands/all', { fixture: 'allBrands' });
    cy.intercept(/\/api\/brand\/1$/, { fixture: 'brand' });
  });

  it('should display all brands after clicking Brands button in header', () => {
    cy.intercept('/api/categories/all', { fixture: 'allCategories' });
    cy.intercept('/api/products/numberOfProducts/?page=1', {
      body: 10,
    }).as('numberOfProductsMock');
    cy.intercept('/api/products/filter/?page=1', {
      body: [],
    }).as('productsMock');

    cy.visit('/');
    cy.wait(['@productsMock']).then(() => {
      cy.get('[data-cy=header-brand]').should('be.visible');
      cy.get('[data-cy=header-brand]').click();
      cy.get('@brands').then((brands) => {
        cy.get('[data-cy=product-card]').should('have.length', brands.length);
        brands.forEach((brand) => {
          cy.get('[data-cy=product-card]').should('contain', brand.name);
        });
        cy.get('[data-cy=product-card]').find('img').should('not.have.attr', 'src', '');
      });
    });
  });

  it('should display all brands and redirect to brand page after clicking button', () => {
    cy.fixture('brand').as('brand');
    cy.fixture('productsWithSameBrand').as('productsWithSameBrand');
    cy.intercept('/api/brand/1/viewProducts', {
      fixture: 'productsWithSameBrand',
    }).as('productsWithSameBrandMock');

    cy.visit('/brands');
    cy.get('@brand').then((brand) => {
      cy.get(`a[href*="/brand/${brand.id}"]`).click();
      cy.url().should('include', `/brand/${brand.id}`);
      cy.wait('@productsWithSameBrandMock');
      cy.get('[data-cy=brand-description]').should('contain', brand.name);
    });
    cy.get('[data-cy=brand-image]').should('not.have.attr', 'src', '');
    cy.get('@productsWithSameBrand').then((productsWithSameBrand) => {
      cy.get('[data-cy=product-card]').should('have.length', productsWithSameBrand.length);
      productsWithSameBrand.forEach((product) => {
        cy.get('[data-cy=product-card]')
          .should('contain', product.name)
          .and('contain', product.defaultPrice);
      });
      cy.get('[data-cy=product-card]').should('not.have.attr', 'src', '');
    });
  });

  it('should display a single brand with products', () => {
    cy.fixture('brand').as('brand');
    cy.fixture('productsWithSameBrand').as('productsWithSameBrand');
    cy.intercept('/api/brand/1/viewProducts', {
      fixture: 'productsWithSameBrand',
    }).as('productsWithSameBrandMock');

    cy.visit(`/brand/${brandMockId}`);
    cy.wait('@productsWithSameBrandMock');
    cy.get('@brand').then((brand) => {
      cy.get('[data-cy=brand-description]').should('contain', brand.name);
    });
    cy.get('[data-cy=brand-image]').should('not.have.attr', 'src', '');
    cy.get('@productsWithSameBrand').then((productsWithSameBrand) => {
      cy.get('[data-cy=product-card]').should('have.length', productsWithSameBrand.length);
      productsWithSameBrand.forEach((product) => {
        cy.get('[data-cy=product-card]')
          .should('contain', product.name)
          .and('contain', product.defaultPrice);
      });
      cy.get('[data-cy=product-card]').should('not.have.attr', 'src', '');
    });
  });

  it('should display a single brand without products', () => {
    cy.fixture('brand').as('brand');
    cy.fixture('productsWithSameBrand').as('productsWithSameBrand');
    cy.intercept('/api/brand/1/viewProducts', {
      body: [],
    }).as('productsWithSameBrandMock');

    cy.visit(`/brand/${brandMockId}`);
    cy.wait('@productsWithSameBrandMock');
    cy.get('@brand').then((brand) => {
      cy.get('[data-cy=brand-description]').should('contain', brand.name);
    });
    cy.get('[data-cy=brand-image]').should('not.have.attr', 'src', '');
    cy.get('[data-cy=product-card]').should('have.length', 0);
  });
});

describe('Cart', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.fixture('product').as('product');
    cy.fixture('getCartPrice').as('getCartPrice');

    cy.intercept(`/api/product/${productMockId}`, {
      fixture: 'product',
    }).as('productMock');

    cy.intercept(`/api/brand/3/viewProducts`, {
      body: [],
    }).as('productsWithSameBrand');

    cy.intercept(`/api/products/relatedProducts/?category=Food`, {
      body: [],
    }).as('relatedProducts');

    cy.get('@product').then((product) => {
      cy.visit(`/product/${productMockId}`);
      cy.wait(['@productMock', '@relatedProducts', '@productsWithSameBrand']);
      cy.get('[data-cy=cart-length]').should('contain', '0');
      cy.get('@product').then((product) => {
        cy.get('[data-cy=add-product-to-cart-button]')
          .click()
          .should(() => {
            expect(localStorage.getItem('cart')).to.eq(JSON.stringify([product]));
          });
      });
    });
  });

  it('should display one product in cart', () => {
    cy.get('@product').then((product) => {
      cy.visit('/cart');
      cy.get(`[data-cy=product]`).should('have.length', 1);
      cy.get(`[data-cy=product]`)
        .should('contain', product.name)
        .and('contain', product.defaultPrice);
    });
  });

  it('should remove product from cart after clicking delete button', () => {
    cy.get('@product').then((product) => {
      cy.visit('/cart');
      cy.get(`[data-cy=delete-product-from-cart]`)
        .click()
        .should(() => {
          expect(localStorage.getItem('cart')).to.eq(JSON.stringify([]));
        });
      cy.get(`[data-cy=product]`).should('have.length', 0);
    });
  });

  it('should display the final price after using discounts', () => {
    cy.intercept('/api/getCartPrice/4/1', { fixture: 'getCartPrice' });
    cy.visit('/cart');
    cy.get('@getCartPrice').then((getCartPrice) => {
      cy.get('[data-cy=best-price]').should('not.exist');
      cy.get(`[data-cy=submit-products]`).click();
      cy.get('[data-cy=best-price]').should('contain', getCartPrice.bestPrice);
    });
  });
});
