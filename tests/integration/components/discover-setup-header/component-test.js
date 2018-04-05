import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover setup header', function(hooks) {
  setupRenderingTest(hooks);

  test('sends onBack action when back is clicked', async function(assert) {
    this.set('actionFired', false);
    this.set('onBack', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{discover-setup-header onBack=(action onBack)}}`);
    this.$("button:contains('Back')").click();

    return settled().then(() => {
      assert.equal(this.get('actionFired'), true, "back action should have fired");
    });
  });

  test('sends onNext action when next is clicked', async function(assert) {
    this.set('actionFired', false);
    this.set('onNext', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{discover-setup-header nextButtonText="Next" onNext=(action onNext)}}`);
    this.$("button:contains('Next')").click();

    return settled().then(() => {
      assert.equal(this.get('actionFired'), true, "next action should have fired");
    });
  });
});
