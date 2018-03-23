import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('story-card', 'Integration | Component | story card', {
  integration: true
});

test('it renders', function(assert) {
  // Template block usage:
  this.render(hbs`
    {{#story-card href='http://example.com' as |card|}}
      {{card.image width=300 src='http://lorempixel.com/300/300'}}
      {{#card.body}}
        Foo Title
      {{/card.body}}
    {{/story-card}}
  `);

  assert.ok(this.$('.story-card')[0], 'should render');
  assert.equal(this.$('a').attr('href'), 'http://example.com', 'should render a valid link');
  assert.equal(this.$('a').attr('target'), '_blank', 'should add a target="_blank" attr');
});
