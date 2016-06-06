import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-playlist-play-button', 'Integration | Component | discover playlist play button', {
  integration: true
});

test('it renders as inline', function(assert) {
  this.render(hbs`{{discover-playlist-play-button text="Button Text"}}`);
  assert.equal(this.$().text().trim(), 'Button Text');
});

test('it renders with a block', function(assert) {
  this.render(hbs`{{#discover-playlist-play-button}}Button Text{{/discover-playlist-play-button}}`);
  assert.equal(this.$().text().trim(), 'Button Text');
});
