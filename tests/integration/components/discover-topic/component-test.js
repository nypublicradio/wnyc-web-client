import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover topic', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders unchecked', async function(assert) {
    this.set('title', 'Music');
    this.set('url', 'm-u');
    this.set('isSelected', false);

    await render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

    assert.equal(find('label').textContent.trim(), 'Music');
    assert.equal(find('input[type=checkbox]').getAttribute('name'), 'm-u');
    assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
  });

  test('it renders checked', async function(assert) {
    this.set('title', 'Music');
    this.set('url', 'm-u');
    this.set('isSelected', true);

    await render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

    assert.equal(find('label').textContent.trim(), 'Music');
    assert.equal(find('input[type=checkbox]').getAttribute('name'), 'm-u');
    assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
  });

  test('unchecking and checking box will change attribute', async function(assert) {
    this.set('isSelected', false);
    await render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

    await click('input[type=checkbox]');
    assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
    assert.equal(this.get('isSelected'), true);

    await click('input[type=checkbox]');
    assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
    assert.equal(this.get('isSelected'), false);
  });

  test('when checked element has correct class', async function(assert) {
    this.set('title', 'Music');
    this.set('url', 'm-u');
    this.set('isSelected', false);
    await render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);
    assert.equal(find('.discover-topic').classList.contains('is-selected'), false);

    this.set('isSelected', true);
    assert.equal(find('.discover-topic').classList.contains('is-selected'), true);
  });
});
