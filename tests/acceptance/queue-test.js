import { click, currentURL, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import 'wnyc-web-client/tests/helpers/ember-sortable/test-helpers';
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

  test('visiting /?modal=queue-history', function(assert) {
    server.create('djangoPage', {id:'/'});

    queuePage.visit();

    assert.equal(currentURL(), '/?modal=queue-history');
  });

  test('Queue initial state should be open and empty', function(assert) {
    server.create('djangoPage', {id:'/'});

    queuePage.visit();

    assert.ok(queuePage.queueIsVisible, 'Queue should exists');
    assert.equal(queuePage.stories().count(), 0, 'Queue should be empty');
  });

  test('Queue should sort when you drag an item', function(assert) {
    let listenQueue = this.application.__container__.lookup('service:listen-queue');
    let [{slug:slug1}, {slug:slug2}] = server.createList('story', 2);
    server.create('djangoPage', {id:'/'});

    run(() => {
      listenQueue.addToQueueById(slug1);
      listenQueue.addToQueueById(slug2);
    });

    queuePage.visit();

    assert.ok(queuePage.queueIsVisible, 'Queue should exist');
    assert.equal(queuePage.stories().count(), 2, 'Queue should have two items');

    assert.equal(queuePage.stories(1).title(), 'Story 0', 'story 0 should be first');
    assert.equal(queuePage.stories(2).title(), 'Story 1', 'story 1 should be second');

    // drag story 0 below story 1
    drag('mouse',
      `.queueitem`,
      function() {return {dy: 400, dx:0};}
    );

    assert.equal(queuePage.stories(1).title(), 'Story 1', 'story 1 should be first after dragging');
    assert.equal(queuePage.stories(2).title(), 'Story 0', 'story 0 should be second after dragging');
  });

  test('queue and listening history listen buttons should have data-show and data-story attributes', async function(assert) {
    let listenQueue = this.application.__container__.lookup('service:listen-queue');
    let listenHistory = this.application.__container__.lookup('service:listen-history');

    let stories = server.createList('story', 4, {showTitle: 'foo show'});
    server.create('djangoPage', {id:'/'});

    run(() => {
      listenQueue.addToQueueById(stories[0].slug);
      listenQueue.addToQueueById(stories[1].slug);

      listenHistory.addListen(stories[2]);
      listenHistory.addListen(stories[3]);
    });

    queuePage.visit();

    let listenButtons = findWithAssert('.player-queue [data-test-selector=listen-button]');
    listenButtons.each((i, el) => {
      assert.equal(find(el).getAttribute('data-show'), 'foo show');
      assert.equal(find(el).getAttribute('data-story'), stories[i].title);
    });

    await click('button');
    listenButtons = findWithAssert('.player-history [data-test-selector=listen-button]');
    listenButtons.get().reverse().forEach((el, i) => {
      assert.equal(find(el).getAttribute('data-show'), 'foo show');
      assert.equal(find(el).getAttribute('data-story'), stories[i + 2].title);
    });
  });
});
