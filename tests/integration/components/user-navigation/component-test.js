import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  find
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user navigation', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{user-navigation}}`);
    assert.ok(find('.user-nav-membercenter'));
  });

  test('it shows the login state', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);
    assert.ok(find('.user-nav-logged-in'));
  });

  test('it shows their name', async function(assert) {
    this.set('user', {givenName: 'Matt'});
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn user=user}}`);
    assert.equal(find('.user-nav-logged-in').textContent.trim(), 'Matt');
  });


  test('clicking the button opens the popup', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

    assert.notOk(find('.user-nav-popup'), 'popup should start closed');
    await click('.user-nav-logged-in button');

    assert.ok(find('.user-nav-popup'), 'popup should open');
  });

  test('clicking the button again closes the popup', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

    assert.notOk(find('.user-nav-popup'), 'popup should start closed');
    await click('.user-nav-logged-in button');

    assert.ok(find('.user-nav-popup'), 'popup should open');
    await click('.user-nav-logged-in button');

    assert.notOk(find('.user-nav-popup'), 'popup should close');
  });

  test('clicking outside closes the popup', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`<div id="outside">outside</div>{{user-navigation isLoggedIn=isLoggedIn}}`);

    assert.notOk(find('.user-nav-popup'), 'popup should start closed');
    await click('.user-nav-logged-in button');

    assert.ok(find('.user-nav-popup'), 'popup should open');
    await click('#outside');

    assert.notOk(find('.user-nav-popup'), 'popup should close');
  });
});
