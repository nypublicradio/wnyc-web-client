import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('animated-loading-icon', 'Integration | Component | animated loading icon', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{animated-loading-icon}}`);
  assert.equal(this.$('canvas').length, 1);
});

test('it sets the width and height on the canvas element', function(assert) {
  this.set('height', 100);
  this.set('width', 100);

  this.render(hbs`{{animated-loading-icon width=width height=height}}`);
  assert.equal(this.$('canvas').attr('width'), 100);
  assert.equal(this.$('canvas').attr('height'), 100);
});
