import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import historyPage from 'wqxr-web-client/tests/pages/history';
import velocity from 'velocity';

module('Acceptance | history', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /?modal=queue-history', async function(assert) {
    assert.expect(2);
    velocity.mock = true; //skip animations

    server.create('djangoPage', {id:'fake/'});

    await historyPage.visit();
    await historyPage.clickHistoryTab();

    assert.equal(currentURL(), '/fake?modal=queue-history');
    assert.ok(historyPage.historyIsVisible, 'History should exist');
  });

  test('History initial state should be empty', async function(assert) {
    assert.expect(3);
    velocity.mock = true;

    server.create('djangoPage', {id:'fake/'});

    await historyPage.visit();
    await historyPage.clickHistoryTab();

    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories.length, 0, 'History should be empty');
    assert.ok(historyPage.emptyMessageIsVisible, 'Empty message should be visible');
  });

  test('History should show items', async function(assert) {
    assert.expect(5);
    velocity.mock = true;

    let listenHistory = this.owner.lookup('service:listen-history');
    let stories = server.createList('story', 2);
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);
    listenHistory.addListen(stories[0]);

    server.create('djangoPage', {id:'fake/'});
    await historyPage.visit();
    await historyPage.clickHistoryTab();
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories.length, 3, 'History should show three items');
    assert.equal(historyPage.stories[0].title, 'Story 0', 'First Title should be correct');
    assert.equal(historyPage.stories[1].title, 'Story 1', 'Second Title should be correct');
    assert.equal(historyPage.stories[2].title, 'Story 0', 'Third Title should be correct');
  });


  test('History clear all widget', async function(assert) {
    assert.expect(5);
    velocity.mock = true;

    let listenHistory = this.owner.lookup('service:listen-history');
    let stories = server.createList('story', 2);
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);


    server.create('djangoPage', {id:'fake/'});
    await historyPage.visit();
    await historyPage.clickHistoryTab();
    await historyPage.clickClearHistory();
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.ok(historyPage.clearPromptIsVisible, 'Clear widget should show Yes/No prompt');
    assert.equal(historyPage.stories.length, 2, 'History should show two items');

    await historyPage.clickNo();
    assert.equal(historyPage.stories.length, 2, 'History should still show two items after clicking no');

    await historyPage.clickClearHistory();
    await historyPage.clickYes();
    assert.equal(historyPage.stories.length, 0, 'History should show zero items after clicking yes');
  });

  test('History delete button', async function(assert) {
    assert.expect(4);
    velocity.mock = true;

    let listenHistory = this.owner.lookup('service:listen-history');
    let stories = server.createList('story', 2);
    listenHistory.addListen(stories[0]);
    listenHistory.addListen(stories[1]);


    server.create('djangoPage', {id:'fake/'});
    await historyPage.visit();
    await historyPage.clickHistoryTab();
    assert.ok(historyPage.historyIsVisible, 'History should exist');
    assert.equal(historyPage.stories.length, 2, 'History should show two items');

    await historyPage.stories[0].clickDelete(); // items are pushed onto a stack; first in DOM is most recently added
    assert.equal(historyPage.stories.length, 1, 'History should show one item after clicking delete');
    assert.equal(historyPage.stories[0].title, 'Story 0', 'Remaining item should have correct title');
  });
});
