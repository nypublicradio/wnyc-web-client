import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import config from 'wqxr-web-client/config/environment';
import { currentSession } from 'wqxr-web-client/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | reset');

const email = 'test@example.com';
const password = 'password1';
const confirmation = '12345';
const resetUrl = '/reset';
const resetUrlWithEmail = `${resetUrl}?email=${email}&confirmation=null`;
const resetUrlWithEmailAndConfirmation = `${resetUrl}?email=${email}&confirmation=${confirmation}`;

test('visiting /reset with no params', function(assert) {
  visit(resetUrl);

  andThen(() => {
    assert.equal(currentURL(), '/forgot', 'it should redirect to forgot password page if you go to /reset with no params');
  });
});

test('visiting /reset with a bad code', function(assert) {
  visit(resetUrlWithEmail);

  andThen(() => {
    assert.equal(currentURL(), resetUrlWithEmail);
    assert.equal(find('.account-form-heading').text().trim(), 'Reset your password', 'it should show the reset password form');
  });

  fillIn('input[name=password]', password);
  click('button:contains(Reset password)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Oops!', 'it should show an oops page when you click reset password with a bad code');
  });
});

test('visiting /reset and resetting password and logging in', function(assert) {
  server.create('user');
  visit(resetUrlWithEmailAndConfirmation);

  andThen(() => {
    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
    assert.equal(find('.account-form-heading').text().trim(), 'Reset your password', 'it should show the reset password form');
  });

  fillIn('input[name=password]', password);
  click('button:contains(Reset password)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Log in to WQXR', 'it should show a login form when you click reset password with a good email code and password');
  });

  fillIn('input[name=email]', email);
  fillIn('input[name=password]', password);

  click('button[type=submit]:contains(Log in)');

  andThen(() => {
    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });
});


test('visiting /reset and getting a server error when submitting the form', function(assert) {
  server.post(`${config.wnycAuthAPI}/v1/confirm/password-reset`, () => {
    return new Response(500);
  });

  visit(resetUrlWithEmailAndConfirmation);

  andThen(() => {
    assert.equal(currentURL(), resetUrlWithEmailAndConfirmation);
    assert.equal(find('.account-form-heading').text().trim(), 'Reset your password', 'it should show the reset password form');
  });

  fillIn('input[name=password]', password);
  click('button:contains(Reset password)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Reset your password', 'it should remain on the form when the reset url returns other errors.');
  });
});
