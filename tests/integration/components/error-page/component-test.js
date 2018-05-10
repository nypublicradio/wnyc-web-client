import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | error page', function(hooks) {
  setupRenderingTest(hooks);

  // commenting this out b/c skipping the first or last test in a module causes unexpected behavior
  // see: https://github.com/ember-cli/ember-cli-qunit/issues/179
  // test('it renders 500 page', function(assert) {
  //   let testError = {
  //     'response': {
  //       'status': 500
  //     }
  //   };
  //   this.set("testError", testError);
  //
  //   this.render(hbs`{{error-page error=testError}}`);
  //
  //   assert.equal(this.$('.error-text-block h1').text().trim(), "Oops, something went wrong...");
  //   assert.equal(this.$('.error-text-block p').text().trim(), "We're experiencing an internal server error. Please try again later.");
  //
  // });

  test('it renders 404 page', async function(assert) {
    await render(hbs`{{error-page errorCode='404'}}`);

    assert.ok(find('[data-test-selector="404"]'));
  });
});
