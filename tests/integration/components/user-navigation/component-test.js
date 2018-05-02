import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  settled,
  click,
  findAll,
  find
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user navigation', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{user-navigation}}`);
    assert.equal(findAll('.user-nav-signup').length, 1);
  });

  test('it shows the login state', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);
    assert.equal(findAll('.user-nav-logged-in').length, 1);
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

    assert.equal(findAll('.user-nav-popup').length, 0, 'popup should start closed');
    await click('.user-nav-logged-in button');

    return settled().then(() => {
      assert.equal(findAll('.user-nav-popup').length, 1, 'popup should open');
    });
  });

  test('clicking the button again closes the popup', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

    assert.equal(findAll('.user-nav-popup').length, 0, 'popup should start closed');
    await click('.user-nav-logged-in button');


    assert.equal(findAll('.user-nav-popup').length, 1, 'popup should open');
    await click('.user-nav-logged-in button');

    assert.equal(findAll('.user-nav-popup').length, 0, 'popup should close');
  });

  test('clicking outside closes the popup', async function(assert) {
    this.set('isLoggedIn', true);
    await render(hbs`<div id="outside">outside</div>{{user-navigation isLoggedIn=isLoggedIn}}`);

    assert.equal(findAll('.user-nav-popup').length, 0, 'popup should start closed');
    await click('.user-nav-logged-in button');

    assert.equal(findAll('.user-nav-popup').length, 1, 'popup should open');
    await click('#outside');

    assert.equal(findAll('.user-nav-popup').length, 0, 'popup should close');
  });
});
