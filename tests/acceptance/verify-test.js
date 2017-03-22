import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | verify');

test('visiting /verify unauthenticated shows a login form', function(assert) {
  visit('/verify');

  return andThen(() => {
    assert.equal(currentURL(), '/verify');
    assert.equal(find('.account-form-heading').text().trim(), 'Log in to WNYC');
  });
});

test('visiting /verify with correct params takes you to profile with success alert', function(assert) {
  authenticateSession(this.application, {access_token: 'foo'});
  server.create('user');

  visit('/verify?verification_code=abc&email_pk=def');

  return andThen(() => {
    assert.equal(currentURL(), '/profile');
    assert.equal(find('.alert.alert-success').length, 1);
  });
});

test('visiting /verify with missing params takes you to profile with warning alert', function(assert) {
  authenticateSession(this.application, {access_token: 'foo'});
  server.create('user');

  visit('/verify');

  return andThen(() => {
    assert.equal(currentURL(), '/profile');
    assert.equal(find('.alert.alert-warning').length, 1);
  });
});

test('visiting /verify with correct params and logging in takes you to profile with success alert', function(assert) {
  server.create('user');

  visit('/verify?verification_code=abc&email_pk=def');

  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=password]', 'password1');
  click('button[type=submit]:contains(Log in)');

  return andThen(() => {
    assert.equal(currentURL(), '/profile');
    assert.equal(find('.alert.alert-success').length, 1);
  });
});

test('visiting /verify with missing params and logging in takes you to profile with warning alert', function(assert) {
  server.create('user');

  visit('/verify');

  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=password]', 'password1');
  click('button[type=submit]:contains(Log in)');

  return andThen(() => {
    assert.equal(currentURL(), '/profile');
    assert.equal(find('.alert.alert-warning').length, 1);
  });
});
