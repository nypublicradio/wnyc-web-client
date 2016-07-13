import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-button', 'Integration | Component | action button', {
  integration: true
});

test('it can accept an icon argument and places it to the right by default', function(assert) {
  this.render(hbs`{{action-button icon='play' text="Play"}}`);
  assert.equal(this.$('.action-button-text').text().trim(), 'Play');
  assert.equal(this.$('.action-button-icon svg').length, 1, "should have icon");
  assert.equal(this.$('.action-button-text + .action-button-icon').length, 1, "should have icon to the right");

  this.render(hbs`{{action-button icon='play'}}Play{{/action-button}}`);
  assert.equal(this.$('.action-button-text').text().trim(), 'Play');
  assert.equal(this.$('.action-button-icon svg').length, 1, "should have icon");
  assert.equal(this.$('.action-button-text + .action-button-icon').length, 1, "should have icon to the right");
});

test('it can accept an icon argument and places it to the left if asked', function(assert) {
  this.render(hbs`{{action-button icon='play' text="Play" iconPlacement='left'}}`);
  assert.equal(this.$('.action-button-text').text().trim(), 'Play');
  assert.equal(this.$('.action-button-icon svg').length, 1, "should have icon");
  assert.equal(this.$('.action-button-icon + .action-button-text').length, 1, "should have icon to the left");

  this.render(hbs`{{#action-button icon='play' iconPlacement='left'}}Play{{/action-button}}`);
  assert.equal(this.$('.action-button-text').text().trim(), 'Play');
  assert.equal(this.$('.action-button-icon svg').length, 1, "should have icon");
  assert.equal(this.$('.action-button-icon + .action-button-text').length, 1, "should have icon to the left");
});

test('no icon argument yields no icon', function(assert) {
  this.render(hbs`{{action-button text="Play"}}`);
  assert.equal(this.$('.action-button-text').text().trim(), 'Play');
  assert.equal(this.$('.action-button-icon svg').length, 0, "should not have icon");
});
