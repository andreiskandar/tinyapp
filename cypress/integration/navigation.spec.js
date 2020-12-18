describe('Navigation', () => {
  it('should visit root then redirect to /urls', () => {
    cy.visit('/');
  });

  it('should navigate to login page', () => {
    cy.visit('/');
    cy.get('div').should('have.class', 'card-header');
  });

  it('should redirect to login page if user is not logged in', () => {});
});

describe('Login', () => {
  it('should be able to login using valid credentials', () => {
    const password = 'purple-monkey-dinosaur';

    cy.visit('/');

    cy.get('input[type=email]').type('user@example.com', { delay: 0 });
    cy.get('input[type=password]').type(password, { delay: 0 });

    cy.contains('button', 'Login').click();
    cy.contains('button', 'Logout');
    cy.contains('td', 'b6UTxQ');
    cy.contains('td', 'https://www.tsn.ca');
    cy.contains('button', 'Edit');
    cy.contains('button', 'Delete');
  });

  xit('should not be able to login using invalid credentials', () => {
    const password = 'purple-monkey-dinosaur';

    cy.visit('/');

    cy.get('input[type=email]').type('invalid@email.com', { delay: 0 });
    cy.get('input[type=password]').type(password, { delay: 0 });

    cy.get('button').contains('Login').click();

    cy.contains('Account does not exist. Please register a new account');
  });
});
