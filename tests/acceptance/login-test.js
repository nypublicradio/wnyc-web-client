import { test, skip } from 'qunit';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import config from 'wqxr-web-client/config/environment';
import { currentSession } from 'wqxr-web-client/tests/helpers/ember-simple-auth';
import 'wnyc-web-client/tests/helpers/with-feature';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
    server.create('stream');
    server.create('user');
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
