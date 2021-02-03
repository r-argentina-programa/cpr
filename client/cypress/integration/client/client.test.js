/// <reference types="cypress" />

describe('<Main/>', () => {
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
    cy.intercept('http://localhost:8000/api/categories/all', { fixture: 'allCategories.json' });
    cy.intercept('http://localhost:8000/api/brands/all', { fixture: 'allBrands.json' });
    cy.intercept('http://localhost:8000/api/products/filter/?page=1', {
      fixture: 'allProducts.json',
    });
    cy.visit('/');
    cy.get('[data-cy=filter-brands]').should('be.visible').click();
    cy.get('[data-cy=filter-categories]').should('be.visible').click();
    cy.get('.item').should('be.visible');

    cy.get('h1.title').should('be.visible');

    cy.get('.card').should('be.visible').as('product');
    console.log('@product');
  });
});
