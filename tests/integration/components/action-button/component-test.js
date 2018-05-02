import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | action button', function(hooks) {
  setupRenderingTest(hooks);

  test('it can accept an icon argument and places it to the right by default', async function(assert) {
    await render(hbs`{{action-button icon='play' text="Play"}}`);
    assert.equal(find('.action-button-text').textContent.trim(), 'Play');
    assert.equal(findAll('.action-button-icon svg').length, 1, "should have icon");
    assert.equal(findAll('.action-button-text + .action-button-icon').length, 1, "should have icon to the right");

    await render(hbs`{{#action-button icon='play'}}Play{{/action-button}}`);
    assert.equal(find('.action-button-text').textContent.trim(), 'Play');
    assert.equal(findAll('.action-button-icon svg').length, 1, "should have icon");
    assert.equal(findAll('.action-button-text + .action-button-icon').length, 1, "should have icon to the right");
  });

  test('it can accept an icon argument and places it to the left if asked', async function(assert) {
    await render(hbs`{{action-button icon='play' text="Play" iconPlacement='left'}}`);
    assert.equal(find('.action-button-text').textContent.trim(), 'Play');
    assert.equal(findAll('.action-button-icon svg').length, 1, "should have icon");
    assert.equal(findAll('.action-button-icon + .action-button-text').length, 1, "should have icon to the left");

    await render(hbs`{{#action-button icon='play' iconPlacement='left'}}Play{{/action-button}}`);
    assert.equal(find('.action-button-text').textContent.trim(), 'Play');
    assert.equal(findAll('.action-button-icon svg').length, 1, "should have icon");
    assert.equal(findAll('.action-button-icon + .action-button-text').length, 1, "should have icon to the left");
  });

  test('no icon argument yields no icon', async function(assert) {
    await render(hbs`{{action-button text="Play"}}`);
    assert.equal(find('.action-button-text').textContent.trim(), 'Play');
    assert.equal(findAll('.action-button-icon svg').length, 0, "should not have icon");
  });
});
