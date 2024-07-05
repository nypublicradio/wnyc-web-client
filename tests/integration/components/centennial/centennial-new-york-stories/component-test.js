import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | centennial/centennial-new-york-stories', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{centennial/centennial-new-york-stories}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#centennial/centennial-new-york-stories}}
        template block text
      {{/centennial/centennial-new-york-stories}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
