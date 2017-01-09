import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/listen-button', 'Integration | Component | persistent player/listen button', {
  integration: true
});

test('it renders currentTitle as title attribute', function(assert) {
  this.set('currentTitle', 'WNYC FM');
  this.render(hbs`{{persistent-player/listen-button currentTitle=currentTitle}}`);
  assert.equal(this.$('button')[0].title, 'Listen to WNYC FM');
});

test('it sets state as class name', function(assert) {
  this.set('state', 'is-playing');
  this.render(hbs`{{persistent-player/listen-button state=state}}`);
  assert.equal(this.$('.is-playing').length, 1);

  this.set('state', 'is-loading');

  assert.equal(this.$('.is-playing').length, 0);
  assert.equal(this.$('.is-loading').length, 1);
});
