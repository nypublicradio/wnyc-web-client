import {
  find,
  click,
  fillIn,
  currentURL,
  visit,
} from '@ember/test-helpers';
import { module, } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import homePage from 'wnyc-web-client/tests/pages/home';
import { Response } from 'ember-cli-mirage';
import config from 'wnyc-web-client/config/environment';
import {
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';


module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /login', async function(assert) {
    await visit('/login');

    assert.equal(currentURL(), '/login');
  });

  test("can't visit /login when authenticated", async function(assert) {
    authenticateSession({access_token: 'foo'});
    server.create('django-page', {id: '/'});
    server.create('user');

    await visit('/login');

    assert.equal(currentURL(), '/');
  });

  test('Log in button is visible at load', async function(assert) {
    await visit('/login');
    assert.ok(find('button[type=submit]'));
  });

  test('Submitting valid credentials redirects to previous route', async function(assert) {
    server.create('user');
    server.create('django-page', {id: '/'});

    await homePage
      .bootstrap()
      .visit();
    await visit('/login');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WNYC');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]');

    assert.ok(currentSession().get('isAuthenticated'));
    assert.equal(currentURL(), '/');
  });

  test('Submitting invalid credentials shows form level error message', async function(assert) {
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(400, {}, {errors: {code: "UnauthorizedAccess"}});
    });

    await visit('/login');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'badpassword2');
    await click('button[type=submit]');

    assert.notOk(currentSession().get('isAuthenticated'));
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WNYC');
    assert.ok(find('.account-form-error'));
  });


  test('Signing in with non-existing email shows form level error message', async function(assert) {
    const EMAIL = 'doesnotexist@example.com';
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(400, {}, {errors: {code: "UserNotFoundException"}});
    });

    await visit('/login');

    await fillIn('input[name=email]', EMAIL);
    await fillIn('input[name=password]', 'password123');
    await click('button[type=submit]');

    assert.notOk(currentSession().get('isAuthenticated'));
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WNYC');
    assert.ok(find('.account-form-error'));
    assert.ok(find('.account-form-error').textContent.match(EMAIL), 'error message contains email address');
  });

  test('Clicking logout hides privileged links', async function(assert) {
    server.create('user');
    server.create('django-page', {id: '/'});
    await visit('/login');

    await fillIn('input[name=email]', 'foo@bar.com');
    await fillIn('input[name=password]', 'bar');
    await click('button[type=submit]');

    assert.equal(currentURL(), '/');
    await click('.user-nav-button'); // show user menu
    assert.equal(find('[title="Log out"]').textContent.trim(), 'Log out');
    await click('[title="Log out"]');

    assert.equal(find('a[href*=login]').textContent.trim(), 'Log in');
  });

  test('Log in with Facebook button is not visible at load', async function(assert) {
    await visit('/login');
    assert.notOk(find('button.account-form-btn--facebook'));
  });
});
