import { test, skip } from 'qunit';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import config from 'wnyc-web-client/config/environment';
import { currentSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';

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

  andThen(() => assert.equal(find('button').text().trim(), 'Log in'));
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
  click('button:contains(Log in)');

  andThen(() => {
    assert.equal(currentSession(this.application).get('isAuthenticated'), true);
    assert.equal(currentURL(), '/');
  });
});

test('Submitting invalid credentials shows error messages', function(assert) {
  server.post(`${config.wnycAuthAPI}/v1/session`, () => {
    return new Response(400, {}, {errors: {code: "UnauthorizedAccess"}});
  });

  visit('/login');

  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=password]', 'badpassword2');
  click('button:contains(Log in)');

  andThen(() => {
    assert.equal(currentSession(this.application).get('isAuthenticated'), false);
    assert.equal(find('.account-form-heading').text().trim(), 'Log in to WNYC');
    assert.equal(find('.nypr-input-error').length, 1);
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
