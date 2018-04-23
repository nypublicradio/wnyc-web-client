import {
  find,
  click,
  fillIn,
  currentURL,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { Response } from 'ember-cli-mirage';
import 'wqxr-web-client/tests/helpers/with-feature';
import {
  authenticateSession,
  currentSession
} from 'wqxr-web-client/tests/helpers/ember-simple-auth';
import dummySuccessProviderFb from 'wqxr-web-client/tests/helpers/torii-dummy-success-provider-fb';
import dummyFailureProvider from 'wqxr-web-client/tests/helpers/torii-dummy-failure-provider';
import { registerMockOnInstance } from 'wqxr-web-client/tests/helpers/register-mock';

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
    server.create('bucket', {slug: 'wqxr-home'});
    server.create('user');
    authenticateSession(this.application, {access_token: 'foo'});

    await visit(signupUrl);

    assert.equal(currentURL(), '/');
  });

  test('Sign up button is visible at load', async function(assert) {
    await visit(signupUrl);
    assert.equal(find('button[type=submit]:contains(Sign up)').length, 1);
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
    await click('button[type=submit]:contains(Sign up)');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Thanks for signing up!');
  });

  test('Sign up with Facebook button is visible at load', async function(assert) {
    withFeature('socialAuth');
    await visit(signupUrl);
    assert.equal(find('button:contains(Sign up with Facebook)').length, 1);

  });

  test('Successful facebook login redirects', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'});
    let user = server.create('user');
    registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
    withFeature('socialAuth');
    await visit(signupUrl);

    await click('button:contains(Sign up with Facebook)');

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
    await visit(signupUrl);

    await click('button:contains(Sign up with Facebook)');

    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').textContent.trim(), "Unfortunately, we can't authorize your account without permission to view your email address.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });

  test('Unsuccessful facebook login shows alert', async function(assert) {
    registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummyFailureProvider);
    withFeature('socialAuth');
    await visit(signupUrl);

    await click('button:contains(Sign up with Facebook)');

    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').textContent.trim(), "We're sorry, but we weren't able to log you in through Facebook.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});
