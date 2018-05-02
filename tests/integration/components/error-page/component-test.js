import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | error page', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders 500 page', async function(assert) {
    let testError = {
      'response': {
        'status': 500
      }
    };
    this.set("testError", testError);

    await render(hbs`{{error-page error=testError}}`);

    assert.equal(find('.error-text-block h1').textContent.trim(), "Oops, something went wrong...");
    assert.equal(find('.error-text-block p').textContent.trim(), "We're experiencing an internal server error. Please try again later.");

  });

  test('it renders 404 page', async function(assert) {
    let testError = {
      'response': {
        'status': 404
      }
    };
    this.set("testError", testError);

    await render(hbs`{{error-page error=testError}}`);

    assert.equal(find('.error-text-block h1').textContent.trim(), "Sorry, this page can’t be found.");
    assert.equal(find('.error-text-block p').textContent.trim(), "You may have typed the address incorrectly or you may have used an outdated link. Try searching for it, or browse our site for more stories.");

  });
});