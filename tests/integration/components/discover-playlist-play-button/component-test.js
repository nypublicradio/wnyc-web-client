import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-playlist-play-button', 'Integration | Component | discover playlist play button', {
  integration: true
});


test('it renders with playing text when playing', function(assert) {
  this.render(hbs`{{discover-playlist-play-button isPlaying=true playingText="Pause" pausedText="Play"}}`);

  assert.equal(this.$().text().trim(), 'Pause');
});

test('it renders with paused text when paused', function(assert) {
  this.render(hbs`{{discover-playlist-play-button isPlaying=true playingText="Pause" pausedText="Play"}}`);

  assert.equal(this.$().text().trim(), 'Play');
});
