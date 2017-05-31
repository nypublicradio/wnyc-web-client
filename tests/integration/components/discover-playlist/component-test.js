import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import { dummyHifi } from 'wnyc-web-client/tests/helpers/hifi-integration-helpers';

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

  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.discover-playlist-story').length, 12);
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
