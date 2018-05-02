import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | make-https', function(hooks) {
  setupRenderingTest(hooks);

  test('it replaces http for https', async function(assert) {
    this.set('someUrl', 'http://whatever.com');

    await render(hbs`{{make-https someUrl}}`);

    assert.equal(this.element.textContent.trim(), 'https://whatever.com');
  });

  test('it does nothing if the url is https', async function(assert) {
    this.set('someUrl', 'https://whatever.com');

    await render(hbs`{{make-https someUrl}}`);

    assert.equal(this.element.textContent.trim(), 'https://whatever.com');
  });

  test('it does nothing if the given string is not a url', async function(assert) {
    this.set('someString', 'ok sure');

    await render(hbs`{{make-https someString}}`);

    assert.equal(this.element.textContent.trim(), 'ok sure');
  });
});
