describe('Example tests to demonstrate functionality', function() {
  it('uses mirage mocks, via Cypress', () => {

    // cy.mirageServer is a command defined in cypress/support/commands.js - it
    // accepts a function as an argument, as seen below (be sure to include
    // server as the first and only argument of your function):
    cy.mirageServer((server) => {
      // set up all mirage objects within this function; it can be set once per
      // test, prior to a cy.visit() command. It can also - optionally - be set
      // up globally for the entire spec file by placing it in `beforeEach()`
      server.createList('stream', 7);
      server.createList('show', 3);
      server.create('django-page', {
        id: '/'
      });
    });

    cy.visit('/');
    cy.get('.django-content').should('exist')

    cy
      .get('.sitechrome-nav .list li')
      .should('have.length', 6)
      .contains('Shows')
      .click();

    cy.url().should('contain', 'shows');
    cy.get('.shows-list li').should('have.length', 3); // based on mirage mock
  });

  it.only('uses mirage passthrough to use backend API and/or mocks', () => {

    // This is a custom command (also set in cypress/support/commands.js) that
    // sets the localStorage value passthrough=true; in the mirage config,
    // this value is checked and, if true, it ignores the entirety of the
    // mirage config and connects directly to the backend API (or the XHR
    // fixtures provided in Cypress).
    cy.miragePassthrough()

    // server is Cypress's version of a fake backend; it allows us to:
    //
    // - use data fixtures to fake our backend with pre-set data
    // - modify requests/responses with a live backend
    // - assert against real requests/responses from our app
    //
    // Also, matchBase is necessary for when the API domain is different from
    // the server domain, which is common when developing locally.
    cy.server({matchBase: false})

    cy.route({
      url: '**',
      onRequest: (xhr) => {
        xhr.url = xhr.url.replace('4200', '3000')
        return xhr
      }
    });

    cy.visit('/');

    cy
      .get('.sitechrome-nav .list li')
      .should('have.length', 6)
      .contains('Shows')
      .click();
    cy.url().should('contain', 'shows');

    cy.visit('/people/');

    cy.route(/shows/).as('shows-api');
    cy
      .get('.sitechrome-nav .list li')
      .should('have.length', 6)
      .contains('Shows')
      .click();
    cy.wait('@shows-api');
    cy.url().should('contain', 'shows');
  });
});
