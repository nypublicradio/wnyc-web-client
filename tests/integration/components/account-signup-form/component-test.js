import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-signup-form', 'Integration | Component | account signup form', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{account-login-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});
