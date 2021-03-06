import {
  click,
  fillIn,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { Response } from 'ember-cli-mirage';
import config from 'wnyc-web-client/config/environment';
import { currentSession } from 'ember-simple-auth/test-support';

module('Acceptance | set password', function(hooks) {
  setupApplicationTest(hooks);

  const email = 'test@example.com';
  const username = 'user1';
  const password = 'password1';
  const code = 'a1b2c3';
  const setPasswordUrl = '/set-password';
  const setPasswordUrlWithParameters = `${setPasswordUrl}?username=${username}&email=${email}&code=${code}&verification_token=token&email_id=email123`;
  const setPasswordUrlWithExpiredCode = `${setPasswordUrl}?username=${username}&email=${email}&code=expired&verification_token=token&email_id=email123`;

  test('visiting /set-password with expired code', async function(assert) {
    await visit(setPasswordUrlWithExpiredCode);

    assert.equal(currentURL(), setPasswordUrlWithExpiredCode);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Create a password', 'it should show the create password form header');
    assert.equal(find('.account-form-description').textContent.trim(), `Create a WNYC password for ${email}.`, 'it should show the create password form desc');

    await fillIn('input[name=password]', password);
    await click('button');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Oops!', 'it should show an oops page when you click create password with a bad code');
  });

  test('visiting /set-password and creating a password and logging in', async function(assert) {
    server.create('django-page', {id: '/'});
    server.create('user');
    server.create('stream');
    await visit(setPasswordUrlWithParameters);

    assert.equal(currentURL(), setPasswordUrlWithParameters);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Create a password', 'it should show the create password form');

    await fillIn('input[name=password]', password);
    await click('button');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Log in to WNYC', 'it should show a login form when you click create password with a good email code and password');

    await fillIn('input[name=email]', email);
    await fillIn('input[name=password]', password);

    await click('button[type=submit]');

    assert.ok(currentSession().get('isAuthenticated'));
  });


  test('visiting /set-password and getting a server error when submitting the form', async function(assert) {
    server.post(`${config.authAPI}/v1/password/change-temp`, () => {
      return new Response(500);
    });

    await visit(setPasswordUrlWithParameters);

    assert.equal(currentURL(), setPasswordUrlWithParameters);
    assert.equal(find('.account-form-heading').textContent.trim(), 'Create a password', 'it should show the create password form');

    await fillIn('input[name=password]', password);
    await click('button');

    assert.equal(find('.account-form-heading').textContent.trim(), 'Create a password', 'it should remain on the form when the reset url returns other errors.');
  });
});
