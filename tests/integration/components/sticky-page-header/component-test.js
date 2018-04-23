import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sticky page header', function(hooks) {
  setupRenderingTest(hooks);

  test('on sticky set it sets the spacer to the height of the content when sticky', async function(assert) {
    this.set('sticky', false);

    await render(hbs`
      {{#sticky-page-header sticky=sticky}}
        <div style="height:200px"></div>
      {{/sticky-page-header}}
    `);
    
    let el = this.$('.sticky-page-header-spacer')[0];

    assert.equal(window.getComputedStyle(el).height, '0px');
    this.set('sticky', true);
    assert.equal(window.getComputedStyle(el).height, '200px', "header spacer should be height of sticky area");
    this.set('sticky', false);
    assert.equal(window.getComputedStyle(el).height, '0px', "header spacer should be zero when sticky is off");
  });
});
