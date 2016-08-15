import { test } from 'qunit';
import run from 'ember-runloop';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import 'overhaul/tests/helpers/ember-sortable/test-helpers'; /* global reorder */

import queuePage from 'overhaul/tests/pages/queue';

moduleForAcceptance('Acceptance | queue');

test('visiting /?modal=queue-history', function(assert) {
  assert.expect(1);
  var done = assert.async();
  server.create('djangoPage', {id:'/'});

  queuePage.visit();

  andThen(function() {
    assert.equal(currentURL(), '/?modal=queue-history');
    done();
  });
});

test('Queue initial state should be open and empty', function(assert) {
  assert.expect(2);
  var done = assert.async();
  server.create('djangoPage', {id:'/'});

  queuePage.visit();

  andThen(function() {
    assert.ok(queuePage.queueIsVisible, 'Queue should exists');
    assert.equal(queuePage.stories().count(), 0, 'Queue should be empty');
    done();
  });
});

test('Queue should sort when you drag an item', function(assert) {
  assert.expect(6);
  var done = assert.async();

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

    // drag story 0 below story 1
    reorder(
      'mouse',
      '.player-queue .queueitem',
      '.queueitem:contains(Story 1)',
      '.queueitem:contains(Story 0)'
    ).then(function() {
      assert.equal(queuePage.stories(1).title(), 'Story 1', 'story 1 should be first after dragging');
      assert.equal(queuePage.stories(2).title(), 'Story 0', 'story 0 should be second after dragging');
      done();
    });
  });
});
