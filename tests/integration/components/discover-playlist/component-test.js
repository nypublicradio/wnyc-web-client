import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { dummyHifi } from 'wnyc-web-client/tests/helpers/hifi-integration-helpers';

module('Integration | Component | discover playlist', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:dj', djStub);
    this.dj = this.owner.lookup('service:dj');

    this.owner.register('service:hifi', dummyHifi);
    this.hifi = this.owner.lookup('service:hifi');

    this.owner.register('service:discover-queue', queueStub);
    this.queue = this.owner.lookup('service:discover-queue');
  });

  const djStub = Service.extend({
    isReady: true,
    isPlaying: false,
    pause() {},
    play() {},
    init() {
      this._super(...arguments);
      this.set('currentlyLoadingIds', []);
    },
  });

  const queueStub = Service.extend({
    removeItem(item) {
      this.set('itemDeleted', item);
    }
  });

  test('it renders playlist items', async function(assert) {
    const stories = server.createList('discover-story', 12);
    this.set('stories', stories);

    await render(hbs`{{discover-playlist stories=stories}}`);
    assert.equal(findAll('.discover-playlist-story').length, 12);
  });

  test('clicking delete on a track sends a delete action', async function(assert) {
    assert.expect(1);

    this.set('stories', server.createList('discover-story', 5));
    this.set('onRemove', (d) => {
      this.set('itemRemoved', d);
    });

    await render(hbs`{{discover-playlist audioReady=true stories=stories onRemoveItem=onRemove}}`);
    await click('.discover-playlist-item-delete');

    assert.equal(this.get('itemRemoved').id, server.db.discoverStories[0].id);
  });

  test('clicking the refresh bar sends a findMore action', async function(assert) {
    this.set('findMore', () => assert.ok('findMore was called'));

    await render(hbs`{{discover-playlist findMore=findMore}}`);
    await click('.discover-refresh-bar');
  });
});
