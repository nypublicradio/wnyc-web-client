import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | page numbers', function(hooks) {
  setupRenderingTest(hooks);

  function retrieveNumbers(context) {
    return context.$('[data-test-selector=page]').text().split("\n").map(s => s.trim()).reject(s => s === '').map(Number);
  }

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{page-numbers}}`);

    assert.equal(find('*').textContent.trim(), '');
  });

  test('it renders dots correctly', async function(assert) {
    await render(hbs`
      {{page-numbers
        currentPage=1
        totalPages=50}}
    `);
    assert.equal(findAll('.dots').length, 1, 'one set of dots');
    assert.deepEqual(retrieveNumbers(this), [1,2,3,4,5,6,7,8,9,10,50], 'correct numbers');
    
    await render(hbs`
      {{page-numbers
        currentPage=7
        totalPages=50}}
    `);
    assert.equal(findAll('.dots').length, 2, 'two sets of dots');
    assert.deepEqual(retrieveNumbers(this), [1,3,4,5,6,7,8,9,10,11,12,50], 'correct numbers');
    
    await render(hbs`
      {{page-numbers
        currentPage=43
        totalPages=50}}
    `);
    assert.equal(findAll('.dots').length, 2, 'two sets of dots');
    assert.deepEqual(retrieveNumbers(this), [1,39,40,41,42,43,44,45,46,47,48,50], 'correct numbers');
    
    await render(hbs`
      {{page-numbers
        currentPage=49
        totalPages=50}}
    `);
    
    assert.equal(findAll('.dots').length, 1, 'one set of dots');
    assert.deepEqual(retrieveNumbers(this), [1,45,46,47,48,49,50], 'correct numbers');
  });
});
