import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('discover-setup-header', 'Integration | Component | discover setup header', {
  integration: true
});

test('sends onBack action when back is clicked', function(assert) {
  this.set('actionFired', false);
  this.set('onBack', () => {
    this.set('actionFired', true);
  });

  this.render(hbs`{{discover-setup-header onBack=(action onBack)}}`);
  this.$("button:contains('Back')").click();

  return wait().then(() => {
    assert.equal(this.get('actionFired'), true, "back action should have fired");
  });
});

test('sends onNext action when next is clicked', function(assert) {
  this.set('actionFired', false);
  this.set('onNext', () => {
    this.set('actionFired', true);
  });

  this.render(hbs`{{discover-setup-header nextButtonText="Next" onNext=(action onNext)}}`);
  this.$("button:contains('Next')").click();

  return wait().then(() => {
    assert.equal(this.get('actionFired'), true, "next action should have fired");
  });
});
