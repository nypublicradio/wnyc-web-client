import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  findAll,
  fillIn,
  triggerEvent
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | embedded/header search field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{embedded/header-search-field}}`);

    assert.equal(findAll('form').length, 1, 'it renders a form');
  });

  test('it calls the passesd in search attr on submit', async function(assert) {
    this.set('search', q => assert.equal(q, 'foo', 'search was invoked'));

    await render(hbs`{{embedded/header-search-field search=search}}`);

    await fillIn('#search-input', 'foo');
    await triggerEvent('#search-input', 'change');
    await triggerEvent('form', 'submit');
  });
});
