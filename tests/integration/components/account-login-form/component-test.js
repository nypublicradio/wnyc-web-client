import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-login-form', 'Integration | Component | account login form', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{account-login-form}}`);
  assert.equal(this.$('.account-form').length(), 1);
});
