import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';


moduleForComponent('story-row', 'Integration | Component | story row', {
  integration: true
});

test('it renders', function(assert) {
  this.set('items', ['foo', 'bar']);
  this.render(hbs`
    {{#story-row as |row|}}
      {{#row.label}}label{{/row.label}}

      {{#row.items items=items as |item|}}
        {{item}}
      {{/row.items}}

    {{/story-row}}
  `);

  return wait().then(() => {
    assert.ok(this.$('.story-row__items').text().split('\n').join('').trim().match(/foo.*bar/), 'should render all items');
    assert.equal(this.$('.story-row__label').text().trim(), 'label');
  });
});
