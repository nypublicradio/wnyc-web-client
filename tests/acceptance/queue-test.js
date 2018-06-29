import { click, currentURL, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import velocity from 'velocity';

import queuePage from 'wnyc-web-client/tests/pages/queue';

module('Acceptance | queue', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
    velocity.mock = true;
  });

  hooks.afterEach(function() {
    velocity.mock = false;
  });

  test('visiting /?modal=queue-history', async function(assert) {
    server.create('djangoPage', {id:'/'});

    await queuePage.visit();

    assert.equal(currentURL(), '/?modal=queue-history');
  });

  test('Queue initial state should be open and empty', async function(assert) {
    server.create('djangoPage', {id:'/'});

    await queuePage.visit();

    assert.ok(queuePage.queueIsVisible, 'Queue should exists');
    assert.equal(queuePage.stories.length, 0, 'Queue should be empty');
  });

  // test('Queue should sort when you drag an item', async function(assert) {
  //   let listenQueue = this.owner.lookup('service:listen-queue');
  //
  //   let [{slug:slug1}, {slug:slug2}] = server.createList('story', 2);
  //   server.create('djangoPage', {id:'/'});
  //
  //   run(() => {
  //     listenQueue.addToQueueById(slug1);
  //     listenQueue.addToQueueById(slug2);
  //   });
  //
  //   await queuePage.visit();
  //
  //   assert.ok(queuePage.queueIsVisible, 'Queue should exist');
  //   assert.equal(queuePage.stories.length, 2, 'Queue should have two items');
  //
  //   assert.equal(queuePage.stories[0].title, 'Story 0', 'story 0 should be first');
  //   assert.equal(queuePage.stories[1].title, 'Story 1', 'story 1 should be second');
  //
  //   // // drag story 0 below story 1
  //   drag('mouse',
  //     `.queueitem`,
  //     function() {return {dy: 400, dx:0};}
  //   );
  //
  //   assert.equal(queuePage.stories[0].title, 'Story 1', 'story 1 should be first after dragging');
  //   assert.equal(queuePage.stories[1].title, 'Story 0', 'story 0 should be second after dragging');
  // });

  test('queue and listening history listen buttons should have data-action and data-label attributes', async function(assert) {
    let listenQueue = this.owner.lookup('service:listen-queue');
    let listenHistory = this.owner.lookup('service:listen-history');

    let applicationStore = this.owner.lookup('session-store:application');
    this.owner.register('session-store:test', applicationStore, {instantiate: false})

    let stories = server.createList('story', 4, {showTitle: 'foo show'});
    server.create('djangoPage', {id:'/'});

    run(() => {
      listenQueue.addToQueueById(stories[0].slug);
      listenQueue.addToQueueById(stories[1].slug);

      listenHistory.addListen(stories[2]);
      listenHistory.addListen(stories[3]);
    });

    await queuePage.visit();

    let listenButtons = Array.from(findAll('.player-queue [data-test-selector=listen-button]'));
    listenButtons.forEach((el, i) => {
      assert.equal(el.getAttribute('data-action'), 'Clicked Play/Pause On Demand');
      assert.equal(el.getAttribute('data-label'), `${stories[i].title} | foo show`);
    });

    await click('.tabbedlist-tab:last-child > button');
    listenButtons = Array.from(findAll('.player-history [data-test-selector=listen-button]'));
    listenButtons.reverse().forEach((el, i) => {
      assert.equal(el.getAttribute('data-action'), 'Clicked Play/Pause On Demand');
      assert.equal(el.getAttribute('data-label'), `${stories[i + 2].title} | foo show`);
    });
  });
});
