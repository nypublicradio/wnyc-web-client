import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover show', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders unchecked', async function(assert) {
    this.set('title', 'Show Title');
    this.set('isSelected', false);
    await render(hbs`{{discover-show title=title isSelected=isSelected}}`);

    assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
  });

  test('it renders checked', async function(assert) {
    this.set('title', 'Show Title');
    this.set('isSelected', true);
    await render(hbs`{{discover-show title=title isSelected=isSelected}}`);

    assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
  });

  // TODO: Why does this fail on Circle CI, but nowhere else?
  // test('unchecking and checking box will change attribute', function(assert) {
  //   this.set('isSelected', false);
  //   this.render(hbs`{{discover-show title=title isSelected=isSelected}}`);
  //
  //   this.$('input[type=checkbox]').click();
  //   assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
  //   assert.equal(this.get('isSelected'), true);
  //
  //   this.$('input[type=checkbox]').click();
  //   assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
  //   assert.equal(this.get('isSelected'), false);
  // });

  test('when checked element has correct class', async function(assert) {
    this.set('isSelected', false);
    await render(hbs`{{discover-show isSelected=isSelected}}`);
    assert.equal(find('.discover-show').classList.contains('is-selected'), false);

    this.set('isSelected', true);
    assert.equal(find('.discover-show').classList.contains('is-selected'), true);
  });
});
