import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | search box', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    await render(hbs`{{search-box}}`);

    assert.equal(find("input").textContent.trim(), '', "Initial text is empty");
  });

  test('should trigger external action on keyup', async function(assert) {

    // test double for the external action
    this.set('filterShows', (actual) => {
      let expected = 'Show Name';
      assert.equal(actual, expected, 'Submitted value is passed to external action');
    });

    await render(hbs`{{search-box key-up=(action this.filterShows)}}`);

    // add text to the search box and trigger a keyup
    await fillIn('input', 'Show Name');
    this.$('input').keyup();

  });
});

