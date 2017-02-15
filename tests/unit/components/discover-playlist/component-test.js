import { moduleForComponent, test } from 'ember-qunit';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Ember from 'ember';

moduleForComponent('discover-playlist', 'Unit | Component | discover playlist', {
  needs: ['component:discover-playlist', 'component:discover-playlist-story', 'component:playlist-play-indicator'],
  unit: true,
  beforeEach() {
    const audioStub = Ember.Service.extend({
      isReady: true,
      currentAudio: {id: 'audioPK'},
      isPlaying: false
    });
    const metricsStub = Ember.Service.extend({
      trackEvent(event) {
        set(this, 'lastTrackedEvent', event);
        set(this, 'trackedEventCount', get(this, 'trackedEventCount') + 1);
      },
      lastTrackedEvent: null,
      trackedEventCount: 0,
    });

    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });
    this.register('service:metrics', metricsStub);
    this.inject.service('metrics', { as: 'metrics' });
  }
});

const stories = [
  {id: 1},{id: 2}
];

test('currentAudioId changes when service audio id changes', function(assert) {
  var component = this.subject();
  assert.equal(component.get('currentAudioId'), 'audioPK');
  component.set('audio.currentAudio.id', 'blah');
  assert.equal(component.get('currentAudioId'), 'blah');
});

test('currentPlaylistStoryPk equals audioId when audio is within playlist', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  component.set('audio.currentAudio.id', 'not-in-dere');
  assert.equal(component.get('currentPlaylistStoryPk'), undefined);
  component.set('audio.currentAudio.id', stories[0].id);
  assert.equal(component.get('currentPlaylistStoryPk'), stories[0].id, 'ooooh fer sure it should be in dere');
});

test('isPlaying is set when the current audio matches a story in the playlist', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  assert.equal(component.get('isPlaying'), false, "should be not playing by default");

  component.set('audio.currentAudio.id', 'not-matching');
  component.set('audio.isPlaying', true);
  assert.equal(component.get('isPlaying'), false, "should not be playing with non-matching id");

  assert.equal(component.get('isPlaying'), false);
  component.set('audio.currentAudio.id', 1);
  component.set('audio.isPlaying', true);
  assert.equal(component.get('isPlaying'), true, "should be playing with matching id and audio service playing");
});

test('isPaused is set when the current audio matches a story in the playlist and current audio is not playing', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  assert.equal(component.get('isPaused'), false, "should be not playing by default");

  component.set('audio.currentAudio.id', 'not-matching');
  component.set('audio.isPlaying', false);
  assert.equal(component.get('isPaused'), false, "playlist isn't paused if track isn't in it");

  component.set('audio.currentAudio.id', 1);
  component.set('audio.isPlaying', false);
  assert.equal(component.get('isPaused'), true, "playlist is paused if track is within it and audio is paused");
});

test("isNotStarted is set when the playlist isn't playing and isn't paused", function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  assert.equal(component.get('isNotStarted'), true, "should be not started by default");

  assert.equal(component.get('isPlaying'), false);
  component.set('audio.currentAudio.id', 1);
  component.set('audio.isPlaying', true);

  assert.equal(component.get('isNotStarted'), false, "has not started is false after audio is playing");

  component.set('audio.isPlaying', false);
  assert.equal(component.get('isNotStarted'), false, "has not started is false after audio is paused");
});

test('currentPlaylistStoryPk is set when the current audio matches a story in the playlist', function(assert) {
  var component = this.subject();
  component.set('stories', stories);

  assert.equal(component.get('currentPlaylistStoryPk'), undefined, "not matching story should have undefined story id");

  component.set('audio.currentAudio.id', 1);

  assert.equal(component.get('currentPlaylistStoryPk'), 1, "matching story should return story pk");
});

test('delete action sends onDeleteItem and marks item as deleted', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  component.set('removedItems', []);

  let story = stories[0];
  component.send('removeItem', story);
  assert.equal(component.get('removedItems').length, 1, "item should be added to removed items list");
});

test('removeItem sends removed item event to metrics', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  component.set('removedItems', []);

  let story = stories[0];
  component.send('removeItem', story);
  assert.equal(component.get('metrics.trackedEventCount'), 1, "it should only send one metrics event");
  assert.deepEqual(component.get('metrics.lastTrackedEvent'),
    {
      category: 'Discover',
      action: 'Removed Story from Discover',
      value: 1
    },
    "it should send the removed item metrics event");
});

test('reorderItems sends moved item event to metrics', function(assert) {
  var component = this.subject();
  component.set('stories', stories);
  component.set('removedItems', []);

  let reorderedStories = stories.slice(0).reverse();
  let story = stories[0];
  component.send('reorderItems', reorderedStories, story);
  assert.equal(component.get('metrics.trackedEventCount'), 1, "it should only send one metrics event");
  assert.deepEqual(component.get('metrics.lastTrackedEvent'),
    {
      category: 'Discover',
      action: 'Moved Story',
      value: 1
    },
    "it should send the moved item metrics event");
});
