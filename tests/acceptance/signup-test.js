import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import 'wnyc-web-client/tests/helpers/with-feature';
import { currentSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';
import dummySuccessProviderFb from 'wnyc-web-client/tests/helpers/torii-dummy-success-provider-fb';
import dummyFailureProvider from 'wnyc-web-client/tests/helpers/torii-dummy-failure-provider';
import { registerMockOnInstance } from 'wnyc-web-client/tests/helpers/register-mock';
import config from 'wnyc-web-client/config/environment';

moduleForAcceptance('Acceptance | signup', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /signup', function(assert) {
  visit('/signup');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
  });
});

test('Sign up button is visible at load', function(assert) {
  visit('/signup');

  andThen(() => assert.equal(find('button[type=submit]:contains(Sign up)').length, 1));
});

test('Submitting the sign up form shows the thank you screen', function(assert) {
  server.create('user');

  visit('/signup');

  fillIn('input[name=given_name]', 'jane');
  fillIn('input[name=family_name]', 'doe');
  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=emailConfirmation]', 'foo@example.com');
  fillIn('input[name=typedPassword]', 'password1234567');
  click('button[type=submit]:contains(Sign up)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Thanks for signing up!');
  });
});

test('Sign up with Facebook button is visible at load', function(assert) {
  withFeature('socialAuth');
  visit('/signup');

  andThen(() => assert.equal(find('button:contains(Sign up with Facebook)').length, 1));
});

test('Successful facebook login redirects and shows correct alert', function(assert) {
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.alert-success').text().trim(), "You’re now logged in via Facebook. You can update your information on your account page.");
    assert.ok(currentSession(this.application).get('isAuthenticated'), 'Session is authenticated');
    assert.equal(find('.user-nav-greeting').text().trim(), 'Jane');
    assert.equal(find('.user-nav-avatar > img').attr('src'), 'https://example.com/avatar.jpg');
  });
});

test('Unsuccessful facebook login shows alert', function(assert) {
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummyFailureProvider);
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').text().trim(), "Unfortunately, we weren't able to authorize your account.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});

test('Unsuccessful fb signup shows alert', function(assert) {
  server.get(`${config.wnycAuthAPI}/v1/session`, {}, 401);
  server.post(`${config.wnycAuthAPI}/v1/user`, {}, 500);
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').text().trim(), "Unfortunately, we weren't able to authorize your account.");
    assert.notOk(currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});
