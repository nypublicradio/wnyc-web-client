import {
  find,
  click,
  fillIn,
  currentURL,
  visit
} from '@ember/test-helpers';
import { module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import testPage from 'wnyc-web-client/tests/pages/listing-page';
import {
  authenticateSession
} from 'ember-simple-auth/test-support';

module('Acceptance | signup', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  const email = 'test@example.com';
  const first = 'Jane';
  const last = 'Doe';
  const signupUrl = '/signup';
  const signupUrlWithParameters = `${signupUrl}?first=${first}&last=${last}&email=${email}`;

  test('visiting /signup', async function(assert) {
    await visit(signupUrl);

    assert.equal(currentURL(), '/signup');
  });

  test("can't visit /signup when authenticated", async function(assert) {
    server.create('user');
    authenticateSession({access_token: 'foo'});
    let page = server.create('django-page', {id: '/'});
    testPage.bootstrap(page);

    await visit(signupUrl);

    assert.equal(currentURL(), '/');
  });

  test('Sign up button is visible at load', async function(assert) {
    await visit(signupUrl);
    assert.ok(find('button[type=submit]'));
  });

  test('Sign up page populates fields from query string', async function(assert) {
    await visit(signupUrlWithParameters);

    assert.equal(currentURL(), signupUrlWithParameters);
    assert.equal(find('input[name=given_name]').value, first);
    assert.equal(find('input[name=family_name]').value, last);
    assert.equal(find('input[name=email]').value, email);
    assert.equal(find('input[name=emailConfirmation]').value, email);
  });

  test('Submitting the sign up form shows the thank you screen', async function(assert) {
    server.create('user');
    await visit(signupUrl);

    await fillIn('input[name=given_name]', 'jane');
    await fillIn('input[name=family_name]', 'doe');
    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=emailConfirmation]', 'foo@example.com');
    await fillIn('input[name=typedPassword]', 'password1234567');
    await click('button[type=submit]');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Thanks for signing up!');
  });

  test('Sign up with Facebook button is not visible at load', async function(assert) {
    await visit(signupUrl);
    assert.notOk(find('button.account-form-btn--facebook'));
  });
});
