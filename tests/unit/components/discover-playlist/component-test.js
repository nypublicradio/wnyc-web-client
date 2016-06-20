import { moduleForComponent, test } from 'ember-qunit';
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

    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });
  }
});

const stories = [
  {id: 'should-not-matter', cmsPK: 1},{id: 'does-not-matter', cmsPK: 2}
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
  component.set('audio.currentAudio.id', stories[0].cmsPK);
  assert.equal(component.get('currentPlaylistStoryPk'), stories[0].cmsPK, 'ooooh fer sure it should be in dere');
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

test('delete action sends delete to discover queue and deletes item from array', function(assert) {
  var component = this.subject();
  component.set('stories', stories);

  var itemDeleted;
  let queueStub = {
    removeItem(item) {
      itemDeleted = item;
    }
  };
  component.set('queue', queueStub);

  let story = stories[0];
  component.send('removeItem', story);
  assert.equal(itemDeleted, story, "should send first deleted item to service");
  assert.equal(component.get('orderedStories').length, 1, "item should be deleted from internal list");
});

test('reordering items sends updates to discover queue', function(assert) {
  var component = this.subject();
  component.set('stories', stories);

  var newQueue;
  let queueStub = {
    updateQueue(items) {
      newQueue = items;
    }
  };

  component.set('queue', queueStub);
  component.send('reorderItems', [{id:10}, {id:11}]);
  assert.deepEqual(newQueue.map(n => n.id), [10, 11]);
});
