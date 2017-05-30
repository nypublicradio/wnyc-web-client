import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import { dummyHifi } from 'wnyc-web-client/tests/helpers/hifi-integration-helpers';
import sinon from 'sinon';

moduleForComponent('discover-playlist', 'Integration | Component | discover playlist', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
    this.register('service:dj', djStub);
    this.inject.service('dj', { as: 'dj' });

    this.register('service:hifi', dummyHifi);
    this.inject.service('hifi', { as: 'hifi' });

    this.register('service:discover-queue', queueStub);
    this.inject.service('discover-queue', { as: 'queue' });
  },
  afterEach() {
    window.server.shutdown();
  }
});

const djStub = Ember.Service.extend({
  isReady: true,
  isPlaying: false,
  pause: () => {},
  play: () => {},
  currentlyLoadingIds: []
});

const queueStub = Ember.Service.extend({
  removeItem(item) {
    this.set('itemDeleted', item);
  }
});

test('it renders playlist items', function(assert) {
  const stories = server.createList('discover-story', 12);
  this.set('stories', stories);
  this.set('dj', djStub);

  this.render(hbs`{{discover-playlist stories=stories dj=dj currentlyLoadingIds=[]}}`);
  assert.equal(this.$('.discover-playlist-story').length, 12);
});

test('clicking play on a track sends a play action to the dj service', function(assert) {
  assert.expect(1);

  this.set('stories', server.createList('discover-story', 5));

  sinon.stub(djStub, 'play').callsFake((storyId) => {
    let firstStory = server.db.discoverStories[0];
    assert.equal(firstStory.id, storyId);
    return Ember.RSVP.Promise.resolve();
  });

  this.set('dj', djStub);

  this.render(hbs`{{discover-playlist stories=stories dj=dj}}`);
  this.$('.playlist-play-indicator-button:first').click();
});

test('play button should be playing when track is playing', function(assert) {
  let stories = server.createList('discover-story', 5);
  let playingStory = stories[0];

  this.set('stories', stories);
  this.set('currentAudioId', playingStory.id);
  this.set('dj.isReady', true);
  this.set('dj.isPlaying', true);

  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.playlist-play-indicator-button:first').text().trim(), "Pause");
});

test('clicking pause on a track sends a pause action to the dj service', function(assert) {
  let stories = server.createList('discover-story', 5);
  let playingStory = stories[0];

  this.set('stories', stories);
  this.set('currentAudioId', playingStory.id);
  this.set('dj.isReady', true);
  this.set('dj.isPlaying', true);

  var pauseActionTriggered = false;
  this.set('dj.pause', () => {
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

test('clicking the refresh bar sends a findMore action', function(assert) {
  this.set('findMore', () => assert.ok('findMore was called'));

  this.render(hbs`{{discover-playlist findMore=findMore}}`);
  this.$('.discover-refresh-bar').click();
});
