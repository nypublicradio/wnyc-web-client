import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | site chrome', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{site-chrome}}`);

    assert.equal(findAll('.l-page').length, 1);

    // Template block usage:
    await render(hbs`
      {{#site-chrome}}
        template block text
      {{/site-chrome}}
    `);

    assert.ok(this.element.textContent.trim().match('template block text'));
  });
});
