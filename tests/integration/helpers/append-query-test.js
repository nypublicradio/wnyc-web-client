import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | append-query', function(hooks) {
  setupRenderingTest(hooks);

  test('it appends a query string to the value', async function(assert) {
    this.setProperties({
      url: 'http://example.com',
      query: 'foo=bar&cats=dogs',
    });

    await render(hbs`{{append-query url query}}`);

    assert.equal(this.element.textContent.trim(), 'http://example.com?foo=bar&cats=dogs', 'adds a ? if the url does not have one');

    this.set('url', 'http://example.com?buz=baz');

    await render(hbs`{{append-query url query}}`);
    assert.equal(this.element.textContent.trim(), 'http://example.com?buz=baz&foo=bar&cats=dogs', 'adds to a query string if one already exists on the url');

    this.set('query', '?so=what');

    await render(hbs`{{append-query url query}}`);
    assert.equal(this.element.textContent.trim(), 'http://example.com?buz=baz&so=what', 'adds to a query string if one already exists on the query');
  });

  test('unexpected values are ok', async function(assert) {
    await render(hbs`{{append-query url query}}`);
    assert.ok('can render undefined');

    this.setProperties({
      url: {some: 'value', not: ['a string']},
      query: 100
    });

    await render(hbs`{{append-query url query}}`);
    assert.ok('can handle non-strings and complex objects');
  });
});
