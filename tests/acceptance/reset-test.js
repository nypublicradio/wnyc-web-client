import {
  click,
  fillIn,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { Response } from 'ember-cli-mirage';
import config from 'wqxr-web-client/config/environment';
import {
  authenticateSession,
  currentSession
} from 'wqxr-web-client/tests/helpers/ember-simple-auth';

module('Acceptance | reset', function(hooks) {
  setupApplicationTest(hooks);

  const email = 'test@example.com';
  const password = 'password1';
  const confirmation = '12345';
  const resetUrl = '/reset';
  const resetUrlWithEmail = `${resetUrl}?email=${email}&confirmation=null`;
  const resetUrlWithEmailAndConfirmation = `${resetUrl}?email=${email}&confirmation=${confirmation}`;

  test('visiting /reset with no params', async function(assert) {
    await visit(resetUrl);

    assert.equal(currentURL(), '/forgot', 'it should redirect to forgot password page if you go to /reset with no params');
  });

  test('visiting /reset deauthenticates but remains on page', async function(assert) {
    server.create('user');
    authenticateSession(this.application, {access_token: 'foo'});

    await visit(resetUrlWithEmailAndConfirmation);

    assert.notOk(currentSession(this.application).get('isAuthenticated'));
    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
  });

  test('visiting /reset with a bad code', async function(assert) {
    await visit(resetUrlWithEmail);

    assert.equal(currentURL(), resetUrlWithEmail);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Reset your password', 'it should show the reset password form');

    await fillIn('input[name=password]', password);
    await click('button:contains(Reset password)');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Oops!', 'it should show an oops page when you click reset password with a bad code');
  });

  test('visiting /reset and resetting password and logging in', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'}); // redirected to homepage
    server.create('stream');
    server.create('user');
    await visit(resetUrlWithEmailAndConfirmation);

    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Reset your password', 'it should show the reset password form');

    await fillIn('input[name=password]', password);
    await click('button:contains(Reset password)');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR', 'it should show a login form when you click reset password with a good email code and password');

    await fillIn('input[name=email]', email);
    await fillIn('input[name=password]', password);

    await click('button[type=submit]:contains(Log in)');

    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });

  test('visiting /reset and resetting password and logging in still works when starting logged in', async function(assert) {
    server.create('stream');
    server.create('user');
    authenticateSession(this.application, {access_token: 'foo'});

    await visit(resetUrlWithEmailAndConfirmation);

    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Reset your password', 'it should show the reset password form');

    await fillIn('input[name=password]', password);
    await click('button:contains(Reset password)');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR', 'it should show a login form when you click reset password with a good email code and password');

    await fillIn('input[name=email]', email);
    await fillIn('input[name=password]', password);

    await click('button[type=submit]:contains(Log in)');

    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });

  test('visiting /reset and getting a server error when submitting the form', async function(assert) {
    server.post(`${config.authAPI}/v1/confirm/password-reset`, () => {
      return new Response(500);
    });

    await visit(resetUrlWithEmailAndConfirmation);

    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Reset your password', 'it should show the reset password form');

    await fillIn('input[name=password]', password);
    await click('button:contains(Reset password)');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Reset your password', 'it should remain on the form when the reset url returns other errors.');
  });
});
