import {
  click,
  fillIn,
  findAll,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | verify', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /verify unauthenticated shows a login form', async function(assert) {
    await visit('/verify');

    assert.equal(currentURL(), '/verify');
    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WQXR');
  });

  test('visiting /verify with correct params takes you to profile with success alert', async function(assert) {
    authenticateSession({access_token: 'foo'});
    server.create('user');

    await visit('/verify?verification_token=abc&email_id=def');

    assert.equal(currentURL(), '/profile');
    assert.equal(findAll('.alert.alert-success').length, 1);
  });

  test('visiting /verify with missing params takes you to profile with warning alert', async function(assert) {
    authenticateSession({access_token: 'foo'});
    server.create('user');

    await visit('/verify');

    assert.equal(currentURL(), '/profile');
    assert.equal(findAll('.alert.alert-warning').length, 1);
  });

  test('visiting /verify with correct params and logging in takes you to profile with success alert', async function(assert) {
    server.create('user');

    await visit('/verify?verification_token=abc&email_id=def');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]');
    assert.equal(currentURL(), '/profile');
    assert.equal(findAll('.alert.alert-success').length, 1);
  });

  test('visiting /verify with missing params and logging in takes you to profile with warning alert', async function(assert) {
    server.create('user');

    await visit('/verify');

    await fillIn('input[name=email]', 'foo@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]');
    assert.equal(currentURL(), '/profile');
    assert.equal(findAll('.alert.alert-warning').length, 1);
  });
});
