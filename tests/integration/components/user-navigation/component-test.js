import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
  this.set('user', {firstName: 'Matt'});
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn user=user}}`);
  assert.equal(this.$('.user-nav-logged-in').text().trim(), 'Hi, Matt');
});


test('clicking the button opens the popup', function(assert) {
  this.set('isLoggedIn', true);
  this.render(hbs`{{user-navigation isLoggedIn=isLoggedIn}}`);

  assert.equal(this.$('.user-nav-popup').length, 0, 'popup should start closed');
  this.$('.user-nav-logged-in button').click();

  assert.equal(this.$('.user-nav-popup').length, 1, 'popup should open');
});
