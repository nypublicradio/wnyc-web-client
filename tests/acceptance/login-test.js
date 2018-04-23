import {
  find,
  click,
  fillIn,
  findAll,
  currentURL,
  visit
} from '@ember/test-helpers';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import { Response } from 'ember-cli-mirage';
import config from 'wqxr-web-client/config/environment';
import {
  authenticateSession,
  currentSession
} from 'wqxr-web-client/tests/helpers/ember-simple-auth';
import 'wqxr-web-client/tests/helpers/with-feature';
import dummySuccessProviderFb from 'wqxr-web-client/tests/helpers/torii-dummy-success-provider-fb';
import dummyFailureProvider from 'wqxr-web-client/tests/helpers/torii-dummy-failure-provider';
import { registerMockOnInstance } from 'wqxr-web-client/tests/helpers/register-mock';

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
    server.create('bucket', {slug: 'wqxr-home'});
    server.create('user');
    authenticateSession(this.application, {access_token: 'foo'});

    await visit('/login');

    assert.equal(currentURL(), '/');
  });

  test('Log in button is visible at load', async function(assert) {
    await visit('/login');
    assert.equal(findAll('button[type=submit]:contains(Log in)').length, 1);
  });

  test('Submitting valid credentials redirects to previous route', async function(assert) {
    server.create('user');
    let page = server.create('django-page', {id: 'fake/'});

    djangoPage
      .bootstrap(page)
      .visit(page);
    await visit('/login');
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]:contains(Log in)');

    assert.equal(currentSession(this.application).get('isAuthenticated'), true);
    assert.equal(currentURL(), '/fake/');
  });

  test('Submitting invalid credentials shows form level error message', async function(assert) {
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(400, {}, {errors: {code: "UnauthorizedAccess"}});
    });

    await visit('/login');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'badpassword2');
    await click('button[type=submit]:contains(Log in)');

    assert.equal(currentSession(this.application).get('isAuthenticated'), false);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR');
    assert.equal(findAll('.account-form-error').length, 1);
  });


  test('Signing in with social only account shows form level error message', async function(assert) {
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(400, {}, {errors: {code: "UserNoPassword"}});
    });

    await visit('/login');

    await fillIn('input[name=email]', 'isignedupwithfacebook@example.com');
    await fillIn('input[name=password]', 'imaginedpassword123');
    await click('button[type=submit]:contains(Log in)');

    assert.equal(currentSession(this.application).get('isAuthenticated'), false);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR');
    assert.equal(findAll('.account-form-error').length, 1);
  });

  test('Signing in with non-existing email shows form level error message', async function(assert) {
    const EMAIL = 'doesnotexist@example.com';
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(400, {}, {errors: {code: "UserNotFoundException"}});
    });

    await visit('/login');

    await fillIn('input[name=email]', EMAIL);
    await fillIn('input[name=password]', 'password123');
    await click('button[type=submit]:contains(Log in)');

    assert.equal(currentSession(this.application).get('isAuthenticated'), false);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR');
    assert.equal(findAll('.account-form-error').length, 1);
    assert.ok(find('.account-form-error').textContent.indexOf(EMAIL) > 0, 'error message contains email address');
  });

  skip('Clicking logout hides privileged links', async function(assert) {
    server.create('django-page', {id: 'fake/'});
    server.create('django-page', {id: 'fake/'});
    await visit('/login');
    await fillIn('input[name=username]', 'foo');
    await fillIn('input[name=password]', 'bar');
    await click('button.submit');


    assert.equal(find('[data-test-selector=logout]').textContent.trim(), 'Sign Out');
    assert.equal(currentURL(), '/');
    await click('[data-test-selector=logout]');


    assert.equal(find('a[href*=login]').textContent.trim(), 'Sign In');

  });

  test('Log in with Facebook button is visible at load', async function(assert) {
    withFeature('socialAuth');
    await visit('/login');
    assert.equal(findAll('button:contains(Log in with Facebook)').length, 1);
  });

  test('Successful facebook login redirects', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'});
    let user = server.create('user');
    registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
    withFeature('socialAuth');
    await visit('/login');

    await click('button:contains(Log in with Facebook)');

    assert.equal(currentURL(), '/');
    assert.ok(currentSession(this.application).get('isAuthenticated'), 'Session is authenticated');
    assert.equal(find('.user-nav-greeting').textContent.trim(), user.given_name);
    assert.equal(find('.user-nav-avatar > img').getAttribute('src'), user.picture);
  });

  test('Facebook login with no email shows alert', async function(assert) {
    server.create('user');
    registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
    server.get('/v1/session', () => {
      return new Response(400, {}, { "errors": {
        "code": "MissingAttributeException",
        "message": "A provider account could not be created because one or more attributes were not available from the provider. Permissions may have been declined.",
        "values": ["email"] }
      });
    });

    withFeature('socialAuth');
    await visit('/login');

    await click('button:contains(Log in with Facebook)');

    assert.equal(currentURL(), '/login');
    assert.equal(find('.alert-warning').textContent.trim(), "Unfortunately, we can't authorize your account without permission to view your email address.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });

  test('Unsuccessful facebook login shows alert', async function(assert) {
    registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummyFailureProvider);
    withFeature('socialAuth');
    await visit('/login');

    await click('button:contains(Log in with Facebook)');

    assert.equal(currentURL(), '/login');
    assert.equal(find('.alert-warning').textContent.trim(), "We're sorry, but we weren't able to log you in through Facebook.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});
