import {
  click,
  fillIn,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';

module('Acceptance | validate', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /validate with no params', async function(assert) {
    await visit('/validate');

    assert.equal(currentURL(), '/validate');
    assert.equal(find('h2').textContent.trim(), 'Oops!');
  });

  test('visiting /validate deauthenticates but remains on page', async function(assert) {
    server.create('user');
    authenticateSession({access_token: 'foo'});
    await visit('/validate');

    assert.notOk(currentSession().get('isAuthenticated'));
    assert.equal(currentURL(), '/validate');
  });

  test('visiting /validate and logging in', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'}); // redirected to homepage
    server.create('stream');
    server.create('user');
    await visit('/validate?username=test&confirmation=123');

    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').textContent.trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').textContent.trim(), 'Log in to WQXR');
    await fillIn('input[name=email]', 'user@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]');
    assert.ok(currentSession().get('isAuthenticated'));
  });

  test('visiting /validate and logging in even when starting logged in', async function(assert) {
    server.create('stream');
    server.create('user');
    authenticateSession({access_token: 'foo'});

    await visit('/validate?username=test&confirmation=123');

    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').textContent.trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').textContent.trim(), 'Log in to WQXR');
    await fillIn('input[name=email]', 'user@example.com');
    await fillIn('input[name=password]', 'password1');
    await click('button[type=submit]');
    assert.ok(currentSession().get('isAuthenticated'));
  });
});
