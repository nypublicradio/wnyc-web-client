import { test } from 'qunit';
import run from 'ember-runloop';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import historyPage from 'overhaul/tests/pages/history';

moduleForAcceptance('Acceptance | history');

test('visiting /?modal=queue-history', function(assert) {
  assert.expect(2);
  $.Velocity.mock = true; //skip animations

  server.create('djangoPage', {id:'/'});

  historyPage.visit();
  historyPage.clickHistoryTab();

  andThen(function() {
    assert.equal(currentURL(), '/?modal=queue-history');
    assert.ok(historyPage.historyIsVisible, 'History should exist');
  });
});

test('History initial state should be empty', function(assert) {
  assert.expect(3);
  $.Velocity.mock = true;

  server.create('djangoPage', {id:'/'});

  historyPage.visit();
  historyPage.clickHistoryTab();

  andThen(function() {
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories().count(), 0, 'History should be empty');
    assert.ok(historyPage.emptyMessageIsVisible, 'Empty message should be visible');
  });
});

test('History should show items', function(assert) {
  assert.expect(5);
  $.Velocity.mock = true;

  let listenHistory = this.application.__container__.lookup('service:listen-history');
  let stories = server.createList('story', 2);
  run(() => {
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);
    listenHistory.addListen(stories[0]);
  });

  andThen(function() {
    server.create('djangoPage', {id:'/'});
    historyPage.visit();
    historyPage.clickHistoryTab();
  });

  andThen(function() {
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories().count(), 3, 'History should show three items');
    assert.equal(historyPage.stories(1).title(), 'Story 0', 'First Title should be correct');
    assert.equal(historyPage.stories(2).title(), 'Story 1', 'Second Title should be correct');
    assert.equal(historyPage.stories(3).title(), 'Story 0', 'Third Title should be correct');
  });
});


test('History clear all widget', function(assert) {
  assert.expect(5);
  $.Velocity.mock = true;

  let listenHistory = this.application.__container__.lookup('service:listen-history');
  let stories = server.createList('story', 2);
  run(() => {
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);
  });

  andThen(function() {
    server.create('djangoPage', {id:'/'});
    historyPage.visit();
    historyPage.clickHistoryTab();
    historyPage.clickClearHistory();
  });

  andThen(function() {
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.ok(historyPage.clearPromptIsVisible, 'Clear widget should show Yes/No prompt');
    assert.equal(historyPage.stories().count(), 2, 'History should show two items');

    historyPage.clickNo();
  });

  andThen(function() {
    assert.equal(historyPage.stories().count(), 2, 'History should still show two items after clicking no');

    historyPage.clickClearHistory();
    historyPage.clickYes();
  });

  andThen(function() {
    assert.equal(historyPage.stories().count(), 0, 'History should show zero items after clicking yes');
  });
});

test('History delete button', function(assert) {
  assert.expect(4);
  $.Velocity.mock = true;

  let listenHistory = this.application.__container__.lookup('service:listen-history');
  let stories = server.createList('story', 2);
  run(() => {
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);
  });

  andThen(function() {
    server.create('djangoPage', {id:'/'});
    historyPage.visit();
    historyPage.clickHistoryTab();
  });

  andThen(function() {
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories().count(), 2, 'History should show two items');

    historyPage.stories(1).clickDelete();
  });

  andThen(function() {
    assert.ok(historyPage.stories().count(), 1, 'History should show one item after clicking delete');
    assert.ok(historyPage.stories(1).title, 'Story 1', 'Remaining item should have correct title');
  });
});
