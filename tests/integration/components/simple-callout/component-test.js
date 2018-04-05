import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple callout', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    await render(hbs`{{simple-callout}}`);

    assert.equal(find('*').textContent.trim(), '');

    await render(hbs`
      {{#simple-callout}}
        template block text
      {{/simple-callout}}
    `);

    assert.equal(find('*').textContent.trim(), 'template block text');
  });


  test('it displays button text', async function(assert) {

    await render(hbs`{{simple-callout button-text='button text'}}`);

    assert.equal(find('*').textContent.trim(), 'button text');
  });
});
