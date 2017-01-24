import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('user-navigation', 'Integration | Component | user navigation', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-navigation}}`);
  assert.equal(this.$('.user-nav-signup').length, 1);
});

test('it shows the login state', function(assert) {
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);
  assert.equal(this.$('.user-nav-logged-in').length, 1);
});

test('it says hi to the user with their name', function(assert) {
  this.set('user', {givenName: 'Matt'});
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn user=user}}`);
  assert.equal(this.$('.user-nav-logged-in').text().trim(), 'Hi, Matt');
});


test('clicking the button opens the popup', function(assert) {
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

  assert.equal(this.$('.user-nav-popup').length, 0, 'popup should start closed');
  this.$('.user-nav-logged-in button').click();

  return wait().then(() => {
    assert.equal(this.$('.user-nav-popup').length, 1, 'popup should open');
  });
});

test('clicking the button again closes the popup', function(assert) {
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

  assert.equal(this.$('.user-nav-popup').length, 0, 'popup should start closed');
  this.$('.user-nav-logged-in button').click();

  wait().then(() => {
    assert.equal(this.$('.user-nav-popup').length, 1, 'popup should open');
    this.$('.user-nav-logged-in button').click();
  });

  return wait().then(() => {
    assert.equal(this.$('.user-nav-popup').length, 0, 'popup should close');
  });
});

test('clicking outside closes the popup', function(assert) {
  this.set('isLoggedIn', true);
  this.render(hbs`<div id="outside">outside</div>{{user-navigation isLoggedIn=isLoggedIn}}`);

  assert.equal(this.$('.user-nav-popup').length, 0, 'popup should start closed');
  this.$('.user-nav-logged-in button').click();

  wait().then(() => {
    assert.equal(this.$('.user-nav-popup').length, 1, 'popup should open');
    this.$('#outside').click();
  });

  return wait().then(() => {
    assert.equal(this.$('.user-nav-popup').length, 0, 'popup should close');
  });});
