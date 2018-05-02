import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover setup header', function(hooks) {
  setupRenderingTest(hooks);

  test('sends onBack action when back is clicked', async function(assert) {
    this.set('actionFired', false);
    this.set('onBack', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{discover-setup-header onBack=(action onBack)}}`);
    await click("button");

    assert.equal(this.get('actionFired'), true, "back action should have fired");
  });

  test('sends onNext action when next is clicked', async function(assert) {
    this.set('actionFired', false);
    this.set('onNext', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{discover-setup-header nextButtonText="Next" onNext=(action onNext)}}`);
    await click('.discover-setup-header :last-child > button');

    assert.equal(this.get('actionFired'), true, "next action should have fired");
  });
});
