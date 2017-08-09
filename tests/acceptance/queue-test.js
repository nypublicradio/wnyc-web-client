import { test } from 'qunit';
import run from 'ember-runloop';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import 'wqxr-web-client/tests/helpers/ember-sortable/test-helpers';
import velocity from 'velocity';

import queuePage from 'wqxr-web-client/tests/pages/queue';

moduleForAcceptance('Acceptance | queue', {
  beforeEach() {
    server.create('stream');
    velocity.mock = true;
  },
  afterEach() {
    velocity.mock = false;
  }
});

test('visiting /?modal=queue-history', function(assert) {
  server.create('djangoPage', {id:'fake/'});

  queuePage.visit();

  andThen(function() {
    assert.equal(currentURL(), '/fake?modal=queue-history');
  });
});

test('Queue initial state should be open and empty', function(assert) {
  server.create('djangoPage', {id:'fake/'});

  queuePage.visit();

  andThen(function() {
    assert.ok(queuePage.queueIsVisible, 'Queue should exists');
    assert.equal(queuePage.stories().count(), 0, 'Queue should be empty');
  });
});

test('Queue should sort when you drag an item', function(assert) {
  let listenQueue = this.application.__container__.lookup('service:listen-queue');
  let [{slug:slug1}, {slug:slug2}] = server.createList('story', 2);
  server.create('djangoPage', {id:'fake/'});

  run(() => {
    listenQueue.addToQueueById(slug1);
    listenQueue.addToQueueById(slug2);
  });

  queuePage.visit();

  andThen(function() {
    assert.ok(queuePage.queueIsVisible, 'Queue should exist');
    assert.equal(queuePage.stories().count(), 2, 'Queue should have two items');

    assert.equal(queuePage.stories(1).title(), 'Story 0', 'story 0 should be first');
    assert.equal(queuePage.stories(2).title(), 'Story 1', 'story 1 should be second');
  });

  // drag story 0 below story 1
  drag('mouse',
    `.queueitem:contains(Story 0)`,
    function() {return {dy: 400, dx:0};}
  );

  andThen(function() {
    assert.equal(queuePage.stories(1).title(), 'Story 1', 'story 1 should be first after dragging');
    assert.equal(queuePage.stories(2).title(), 'Story 0', 'story 0 should be second after dragging');
  });
});

test('queue and listening history listen buttons should have data-show and data-story attributes', function(assert) {
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

  andThen(() => {
    let listenButtons = findWithAssert('.player-queue [data-test-selector=listen-button]');
    listenButtons.each((i, el) => {
      assert.equal($(el).attr('data-show'), 'foo show');
      assert.equal($(el).attr('data-story'), stories[i].title);
    });
    
    click('button:contains(My Listening History)');
  });
  
  andThen(() => {
    let listenButtons = findWithAssert('.player-history [data-test-selector=listen-button]');
    listenButtons.get().reverse().forEach((el, i) => {
      assert.equal($(el).attr('data-show'), 'foo show');
      assert.equal($(el).attr('data-story'), stories[i + 2].title);
    });
  });
  
});
