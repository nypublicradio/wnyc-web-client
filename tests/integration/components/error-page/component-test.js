import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('error-page', 'Integration | Component | error page', {
  integration: true
});

skip('it renders 500 page', function(assert) {
  let testError = {
    'response': {
      'status': 500
    }
  };
  this.set("testError", testError);

  this.render(hbs`{{error-page error=testError}}`);

  assert.equal(this.$('.error-text-block h1').text().trim(), "Oops, something went wrong...");
  assert.equal(this.$('.error-text-block p').text().trim(), "We're experiencing an internal server error. Please try again later.");

});

test('it renders 404 page', function(assert) {
  let testError = {
    'response': {
      'status': 404
    }
  };
  this.set("testError", testError);

  this.render(hbs`{{error-page error=testError}}`);

  assert.ok(this.$('[data-test-selector=404]').length);)
});
