import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('page-numbers', 'Integration | Component | page numbers', {
  integration: true
});

function retrieveNumbers() {
  return $('[data-test-selector=page]').text().split("\n").map(s => s.trim()).reject(s => s === '').map(Number);
}

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{page-numbers}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it renders dots correctly', function(assert) {
  let numbers;
  this.render(hbs`
    {{page-numbers
      currentPage=1
      totalPages=50}}
  `);
  assert.equal(this.$('.dots').length, 1, 'one set of dots');
  assert.deepEqual(retrieveNumbers(), [1,2,3,4,5,6,7,8,9,10,50], 'correct numbers');
  
  this.render(hbs`
    {{page-numbers
      currentPage=7
      totalPages=50}}
  `);
  assert.equal(this.$('.dots').length, 2, 'two sets of dots');
  assert.deepEqual(retrieveNumbers(), [1,3,4,5,6,7,8,9,10,11,12,50], 'correct numbers');
  
  this.render(hbs`
    {{page-numbers
      currentPage=43
      totalPages=50}}
  `);
  assert.equal(this.$('.dots').length, 2, 'two sets of dots');
  assert.deepEqual(retrieveNumbers(), [1,39,40,41,42,43,44,45,46,47,48,50], 'correct numbers');
  
  this.render(hbs`
    {{page-numbers
      currentPage=49
      totalPages=50}}
  `);
  
  assert.equal(this.$('.dots').length, 1, 'one set of dots');
  assert.deepEqual(retrieveNumbers(), [1,45,46,47,48,49,50], 'correct numbers');
});
