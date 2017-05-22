import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import { authenticateSession, currentSession } from 'wqxr-web-client/tests/helpers/ember-simple-auth';
// import { Response } from 'ember-cli-mirage';
// import config from 'wqxr-web-client/config/environment';

moduleForAcceptance('Acceptance | validate');

test('visiting /validate with no params', function(assert) {
  visit('/validate');

  return andThen(() => {
    assert.equal(currentURL(), '/validate');
    assert.equal(find('h2').text().trim(), 'Oops!');
  });
});

test('visiting /validate deauthenticates but remains on page', function(assert) {
  server.create('user');
  authenticateSession(this.application, {access_token: 'foo'});
  visit('/validate');

  return andThen(() => {
    assert.notOk(currentSession(this.application).get('isAuthenticated'));
    assert.equal(currentURL(), '/validate');
  });
});

test('visiting /validate and logging in', function(assert) {
  server.create('bucket', {slug: 'wqxr-home'}); // redirected to homepage
  server.create('stream');
  server.create('user');
  visit('/validate?username=test&confirmation=123');

  andThen(() => {
    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').text().trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').text().trim(), 'Log in to WQXR');
  });

  fillIn('input[name=email]', 'user@example.com');
  fillIn('input[name=password]', 'password1');
  click('button[type=submit]:contains(Log in)');

  return andThen(() => {
    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });
});

test('visiting /validate and logging in even when starting logged in', function(assert) {
  server.create('stream');
  server.create('user');
  authenticateSession(this.application, {access_token: 'foo'});

  visit('/validate?username=test&confirmation=123');

  andThen(() => {
    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').text().trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').text().trim(), 'Log in to WQXR');
  });

  fillIn('input[name=email]', 'user@example.com');
  fillIn('input[name=password]', 'password1');
  click('button[type=submit]:contains(Log in)');

  return andThen(() => {
    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });
});

