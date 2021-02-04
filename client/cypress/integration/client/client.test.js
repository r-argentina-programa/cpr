/// <reference types="cypress" />

describe('<Main/>', () => {
  beforeEach(() => {
    cy.fixture('allCategories.json').as('categories');
    cy.fixture('allBrands.json').as('brands');
    cy.fixture('allProducts.json').as('products');

    cy.intercept('http://localhost:8000/api/products/filter/?page=1', {
      fixture: 'allProducts.json',
    });

    cy.intercept('http://localhost:8000/api/categories/all', { fixture: 'allCategories.json' });
    cy.intercept('http://localhost:8000/api/brands/all', { fixture: 'allBrands.json' });

    cy.intercept('http://localhost:8000/api/products/numberOfProducts/?page=1', {
      fixture: 'numberOfProducts',
    });
  });

  it('Renders main elements ', () => {
    cy.visit('/');
    cy.get('[data-cy=header-title]').should('have.text', 'Market').should('be.visible');
    cy.get('[data-cy=header-brand]').should('have.text', 'Brands').should('be.visible');
    cy.get('[data-cy=header-cart]').should('be.visible');
    cy.get('[data-cy=filter-brands]').should('have.text', 'Brands').should('be.visible');
    cy.get('[data-cy=filter-categories]').should('have.text', 'Categories').should('be.visible');
    cy.get('[data-cy=filter-price]').should('have.text', 'Price').should('be.visible');
  });

  it('Mocks data and displays it', () => {
    cy.visit('/');
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
        cy.get('[data-cy=product-card]').find('img').should('not.have.attr', 'src', '');
      });
    });

    cy.get('h1.title').should('be.visible');
    cy.get('[data-cy=pagination-container]').should('not.have.length', 4);
    cy.get('.card').should('be.visible').as('product');
  });
});
