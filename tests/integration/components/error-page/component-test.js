import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('error-page', 'Integration | Component | error page', {
  integration: true
});

test('it renders 500 page', function(assert) {
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

  assert.equal(this.$('.error-text-block h1').text().trim(), "Sorry, this page can’t be found.");
  assert.equal(this.$('.error-text-block p').text().trim(), "You may have typed the address incorrectly or you may have used an outdated link. Try searching for it, or browse our site for more stories.");

});