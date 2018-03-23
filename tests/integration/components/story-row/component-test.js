import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('story-row', 'Integration | Component | story row', {
  integration: true
});

test('it renders', function(assert) {
  this.set('items', ['foo', 'bar']);
  this.render(hbs`
    {{#story-row items=items as |row|}}
      {{#row.label}}label{{/row.label}}
      {{#row.items as |item|}}
        {{item}}
      {{/row.items}}
    {{/story-row}}
  `);

  assert.ok(this.$('.story-row__items').text().match(/.*foo.*bar.*/g), 'should render all items');
  assert.equal(this.$('.story-row__label').text().trim(), 'label');
});
