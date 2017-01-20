import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nypr-player-integration/stream-info', 'Integration | Component | nypr player integration/stream info', {
  integration: true
});

test('it shows streamsIndexUrl if provided', function(assert) {
  this.set('streamsIndexUrl', 'http://streamsindex/');
  this.render(hbs`{{nypr-player-integration/stream-info streamsIndexUrl=streamsIndexUrl}}`);

  assert.equal(this.$('a[title="All Live Streams"]')[0].href, "http://streamsindex/");

  this.set('streamsIndexUrl', false);
  assert.equal(this.$('a[title="All Live Streams"]').length, 0);
});

test('it shows streamPlaylistUrl if provided', function(assert) {
  this.set('streamPlaylistUrl', 'http://streamsplaylist/');
  this.render(hbs`{{nypr-player-integration/stream-info streamPlaylistUrl=streamPlaylistUrl}}`);

  assert.equal(this.$('a[title="Music Playlist"]')[0].href, "http://streamsplaylist/");

  this.set('streamPlaylistUrl', false);
  assert.equal(this.$('a[title="Music Playlist"]').length, 0);
});

test('it shows streamScheduleUrl', function(assert) {
  this.set('streamScheduleUrl', 'http://streamsschedule/');
  this.render(hbs`{{nypr-player-integration/stream-info streamScheduleUrl=streamScheduleUrl}}`);

  assert.equal(this.$('a[title="Schedule"]')[0].href, "http://streamsschedule/");
});
