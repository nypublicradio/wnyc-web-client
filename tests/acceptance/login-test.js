import { test, skip } from 'qunit';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import config from 'wnyc-web-client/config/environment';
import { currentSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';
import 'wnyc-web-client/tests/helpers/with-feature';
import dummySuccessProviderFb from 'wnyc-web-client/tests/helpers/torii-dummy-success-provider-fb';
import dummyFailureProvider from 'wnyc-web-client/tests/helpers/torii-dummy-failure-provider';
import { registerMockOnInstance } from 'wnyc-web-client/tests/helpers/register-mock';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /login', function(assert) {
  visit('/login');

  andThen(() => {
    assert.equal(currentURL(), '/login');
  });
});

test('Log in button is visible at load', function(assert) {
  visit('/login');

  andThen(() => assert.equal(find('button[type=submit]:contains(Log in)').length, 1));
});

test('Submitting valid credentials redirects to previous route', function(assert) {
  server.create('user');
  let page = server.create('django-page', {id: '/'});

  andThen(() => {
    djangoPage
      .bootstrap(page)
      .visit(page);
  });

  andThen(() => {
    visit('/login');
  });

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Log in to WNYC');
  });

  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=password]', 'password1');
  click('button[type=submit]:contains(Log in)');

  andThen(() => {
    assert.equal(currentSession(this.application).get('isAuthenticated'), true);
    assert.equal(currentURL(), '/');
  });
});

test('Submitting invalid credentials shows form level error message', function(assert) {
  server.create('user');
  server.post(`${config.wnycAuthAPI}/v1/session`, () => {
    return new Response(400, {}, {errors: {code: "UnauthorizedAccess"}});
  });

  visit('/login');

  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=password]', 'badpassword2');
  click('button[type=submit]:contains(Log in)');

  andThen(() => {
    assert.equal(currentSession(this.application).get('isAuthenticated'), false);
    assert.equal(find('.account-form-heading').text().trim(), 'Log in to WNYC');
    assert.equal(find('.account-form-error').length, 1);
  });
});

skip('Clicking logout hides privileged links', function(assert) {
  server.create('user');
  server.create('django-page', {id: '/'});
  visit('/login');
  andThen(() => {
    fillIn('input[name=username]', 'foo');
    fillIn('input[name=password]', 'bar');
    click('button.submit');
  });
  andThen(() => {
    assert.equal(find('[data-test-selector=logout]').text().trim(), 'Sign Out');
    assert.equal(currentURL(), '/');
    click('[data-test-selector=logout]');
  });
  andThen(() => {
    assert.equal(find('a[href*=login]').text().trim(), 'Sign In');
  });
});

test('Log in with Facebook button is visible at load', function(assert) {
  withFeature('socialAuth');
  visit('/login');

  andThen(() => assert.equal(find('button:contains(Log in with Facebook)').length, 1));
});

test('Successful facebook login redirects and shows correct alert', function(assert) {
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  withFeature('socialAuth');
  visit('/login');

  click('button:contains(Log in with Facebook)');

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
  visit('/login');

  click('button:contains(Log in with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/login');
    assert.equal(find('.alert-warning').text().trim(), "Unfortunately, we weren't able to authorize your account.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});

test('Unsuccessful fb login shows alert', function(assert) {
  server.get(`${config.wnycAuthAPI}/v1/session`, {}, 401);
  server.post(`${config.wnycAuthAPI}/v1/user`, {}, 500);
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  withFeature('socialAuth');
  visit('/login');

  click('button:contains(Log in with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/login');
    assert.equal(find('.alert-warning').text().trim(), "Unfortunately, we weren't able to authorize your account.");
    assert.notOk(currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});
