import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';

moduleForComponent('discover-playlist', 'Integration | Component | discover playlist', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });

    this.register('service:discover-queue', queueStub);
    this.inject.service('discover-queue', { as: 'queue' });
  },
  afterEach() {
    window.server.shutdown();
  }
});

const audioStub = Ember.Service.extend({
  isReady: true,
  currentAudio: {id: 'audioPK'},
  isPlaying: false,
  pause: () => {},
  play: () => {}
});

const queueStub = Ember.Service.extend({
  removeItem(item) {
    this.set('itemDeleted', item);
  }
});

test('it renders playlist items', function(assert) {
  const stories = server.createList('discover-story', 12);
  this.set('stories', stories);
  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.discover-playlist-story').length, 12);
});

test('clicking play on a track sends a play action to the audio service', function(assert) {
  assert.expect(1);

  this.set('stories', server.createList('discover-story', 5));
  this.set('audio.isPlaying', false);
  this.set('audio.play', (storyId) => {
    let firstStory = server.db.discoverStories[0];
    assert.equal(firstStory.id, storyId);
  });

  this.render(hbs`{{discover-playlist audioReady=true stories=stories}}`);
  this.$('.playlist-play-indicator-button:first').click();
});

test('play button should be playing when track is playing', function(assert) {
  let stories = server.createList('discover-story', 5);
  let playingStory = stories[0];

  this.set('stories', stories);
  this.set('audio.currentAudio.id', playingStory.id);
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', true);

  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.playlist-play-indicator-button:first').text().trim(), "Pause");
});

test('clicking pause on a track sends a pause action to the audio service', function(assert) {
  let stories = server.createList('discover-story', 5);
  let playingStory = stories[0];

  this.set('stories', stories);
  this.set('audio.currentAudio.id', playingStory.id);
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', true);

  var pauseActionTriggered = false;
  this.set('audio.pause', () => {
    pauseActionTriggered = true;
  });

  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.playlist-play-indicator-button:first label').text().trim(), "Pause", 'should be in playing state');
  this.$('.playlist-play-indicator-button:first').click();

  return wait().then(() => {
    assert.ok(pauseActionTriggered, "Pause should have been called");
  });
});

test('clicking delete on a track sends a delete action', function(assert) {
  assert.expect(1);

  this.set('stories', server.createList('discover-story', 5));
  this.set('onRemove', (d) => {
    this.set('itemRemoved', d);
  });

  this.render(hbs`{{discover-playlist audioReady=true stories=stories onRemoveItem=onRemove}}`);
  this.$('.discover-playlist-item-delete:first').click();

  assert.equal(this.get('itemRemoved').id, server.db.discoverStories[0].id);
});

test('clicking delete on a track sends delete to discover queue', function(assert) {
  assert.expect(1);

  this.set('stories', server.createList('discover-story', 5));

  this.render(hbs`{{discover-playlist audioReady=true stories=stories}}`);
  this.$('.discover-playlist-item-delete:first').click();

  assert.equal(this.get('queue.itemDeleted').id, server.db.discoverStories[0].id);
});

test('clicking find more on the playlist track sends a onFindMore action', function(assert) {
  assert.expect(1);

  this.set('stories', server.createList('discover-story', 5));
  this.set('onFindMore', () => {
    this.set('findingMore', true);
  });

  this.render(hbs`{{discover-playlist audioReady=true stories=stories onFindMore=onFindMore}}`);
  this.$('.discover-playlist-find-more').click();

  assert.equal(this.get('findingMore'), true);
});
