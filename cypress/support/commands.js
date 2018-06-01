/* global Cypress, cy */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// -- This is a dual command --

Cypress.Commands.overwrite("route", (originalFn, ...args) => {
  return originalFn(...args)
});

Cypress.Commands.add("mirageServer", (serverFn) => {
  // This could be more elegant, but communicating with the mirage server via
  // localStorage seems to be the most effective ways to pass configuration
  // back and forth. The function gets encoded as plain text into localStorage,
  // and there is a corresponding `eval` command in mirage/scenarios/default.js
  // that executes the text as a function.
  cy.window().then(win => {
    win.localStorage.mirageServerCommand = serverFn;
  });
});

Cypress.Commands.add("miragePassthrough", () => {
  cy.window().then(win => {
    win.localStorage.passthrough = true;
  })
});
