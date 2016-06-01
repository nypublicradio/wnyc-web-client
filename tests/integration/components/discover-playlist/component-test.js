import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-playlist', 'Integration | Component | discover playlist', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });
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
  playOnDemand: () => {}
});

test('it renders playlist items', function(assert) {
  const stories = server.createList('discover-story', 12);
  this.set('stories', stories);
  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.discover-playlist-story').length, 12);
});

test('clicking play on a track sends a play action to the audio service', function(assert) {
  assert.expect(1);

  this.set('audio.isPlaying', false);
  this.set('audio.playOnDemand', (storyId) => {
    assert.equal(storyId, 1);
  });

  this.set('stories', server.createList('discover-story', 5));

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
  this.set('audio.pause', (args) => {
    pauseActionTriggered = true;
    assert.ok(args);
  });

  this.render(hbs`{{discover-playlist stories=stories}}`);

  this.$('.playlist-play-indicator-button:first').click();

  assert.equal(pauseActionTriggered, true, "Pause should have been called");
});
