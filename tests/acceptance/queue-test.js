import { test } from 'qunit';
import run from 'ember-runloop';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import '../helpers/ember-sortable/test-helpers';
/* global reorder */
import queuePage from 'overhaul/tests/pages/queue';

moduleForAcceptance('Acceptance | queue');

test('visiting /?modal=queue-history', function(assert) {
  server.create('djangoPage', {id:'/'});

  queuePage.visit();

  andThen(function() {
    assert.equal(currentURL(), '/?modal=queue-history');
  });
});

test('Queue initial state should be open and empty', function(assert) {
  server.create('djangoPage', {id:'/'});

  queuePage.visit();

  andThen(function() {
    assert.ok(queuePage.queueIsVisible, 'Queue should exists');
    assert.equal(queuePage.stories().count(), 0, 'Queue should be empty');
  });
});

test('Queue should sort when you drag an item', function(assert) {
  assert.expect(6);

  this.application.injectTestHelpers();

  let listenQueue = this.application.__container__.lookup('service:listen-queue');
  server.createList('story', 2);
  run(() => {
    listenQueue.addToQueueById(1);
    listenQueue.addToQueueById(2);
  });

  andThen(function() {
    server.create('djangoPage', {id:'/'});
    queuePage.visit();
  });

  andThen(function() {
    assert.ok(queuePage.queueIsVisible, 'Queue should exist');
    assert.equal(queuePage.stories().count(), 2, 'Queue should have two items');

    assert.equal(queuePage.stories(1).title(), 'Story 0', 'story 0 should be first');
    assert.equal(queuePage.stories(2).title(), 'Story 1', 'story 1 should be second');

    // drag story 0 down
    // https://github.com/jgwhite/ember-sortable/blob/master/addon/helpers/drag.js
    // drag(
    //   'mouse',
    //   '.player-queue .sortable-item:first-child',
    //   function() {
    //     return {dy: 300, dx: 0};
    //   }
    // );
    reorder(
      'mouse',
      '.player-queue .sortable-item',
      '.sortable-item:contains(Story 1)',
      '.sortable-item:contains(Story 0)'
    );

  });

  andThen(function() {
    assert.equal(queuePage.stories(1).title(), 'Story 1', 'story 1 should be first after dragging');
    assert.equal(queuePage.stories(2).title(), 'Story 0', 'story 0 should be second after dragging');
  });
});
