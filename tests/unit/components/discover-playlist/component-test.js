import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { dummyHifi } from 'wnyc-web-client/tests/helpers/hifi-integration-helpers';

module('Unit | Component | discover playlist', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const dummyDj = Service.extend({
      isReady: true,
      play() {},
      pause() {},
      init() {
        this._super(...arguments);
        this.set('currentlyLoadingIds', []);
      },
    })


    this.owner.register('service:hifi', dummyHifi);
    this.hifi = this.owner.lookup('service:hifi');

    this.owner.register('service:dj', dummyDj);
    this.dj = this.owner.lookup('service:dj');
  });

  const stories = [
    {id: 1},{id: 2}
  ];

  test('currentPlaylistStoryPk equals audioId when audio is within playlist', function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);
    component.set('currentAudioId', 'not-in-dere');
    assert.equal(component.get('currentPlaylistStoryPk'), undefined);
    component.set('currentAudioId', stories[0].id);
    assert.equal(component.get('currentPlaylistStoryPk'), stories[0].id, 'ooooh fer sure it should be in dere');
  });

  test('isPlaying is set when the current audio matches a story in the playlist', function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);
    assert.equal(component.get('isPlaying'), false, "should be not playing by default");

    component.set('currentAudioId', 'not-matching');
    component.set('dj.isPlaying', true);
    assert.equal(component.get('isPlaying'), false, "should not be playing with non-matching id");

    assert.equal(component.get('isPlaying'), false);
    component.set('currentAudioId', 1);
    component.set('dj.isPlaying', true);
    assert.equal(component.get('isPlaying'), true, "should be playing with matching id and audio service playing");
  });

  test('isPaused is set when the current audio matches a story in the playlist and current audio is not playing', function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);
    assert.equal(component.get('isPaused'), false, "should be not playing by default");

    component.set('currentAudioId', 'not-matching');
    component.set('dj.isPlaying', false);
    assert.equal(component.get('isPaused'), false, "playlist isn't paused if track isn't in it");

    component.set('currentAudioId', 1);
    component.set('dj.isPlaying', false);
    assert.equal(component.get('isPaused'), true, "playlist is paused if track is within it and audio is paused");
  });

  test("isNotStarted is set when the playlist isn't playing and isn't paused", function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);
    assert.equal(component.get('isNotStarted'), true, "should be not started by default");

    assert.equal(component.get('isPlaying'), false);
    component.set('currentAudioId', 1);
    component.set('dj.isPlaying', true);

    assert.equal(component.get('isNotStarted'), false, "has not started is false after audio is playing");

    component.set('dj.isPlaying', false);
    assert.equal(component.get('isNotStarted'), false, "has not started is false after audio is paused");
  });

  test('currentPlaylistStoryPk is set when the current audio matches a story in the playlist', function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);

    assert.equal(component.get('currentPlaylistStoryPk'), undefined, "not matching story should have undefined story id");

    component.set('currentAudioId', 1);

    assert.equal(component.get('currentPlaylistStoryPk'), 1, "matching story should return story pk");
  });

  test('delete action sends onDeleteItem and marks item as deleted', function(assert) {
    var component = this.owner.factoryFor('component:discover-playlist').create();
    component.set('stories', stories);
    component.set('removedItems', []);

    let story = stories[0];
    component.send('removeItem', story);
    assert.equal(component.get('removedItems').length, 1, "item should be added to removed items list");
  });

});
