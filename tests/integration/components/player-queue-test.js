import { moduleForComponent, test } from 'ember-qunit';
import { copy } from 'ember-metal/utils';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-queue', 'Integration | Component | player queue', {
  integration: true
});

const emptyQueue = {
  currentAudio: null,
  queue: { items: [] }
};

const queueWithItems = {
  currentAudio: {},
  queue: { items: [
    {id: 1, title: 'listitem-a'},
    {id: 2, title: 'listitem-b'},
    {id: 3, title: 'listitem-c'}
  ]}
};

const nowPlayingEmpty = {
  currentAudio: {id: 1, title: 'listitem-a'},
  queue: { items: []}
};

const nowPlayingWithItems = {
  currentAudio: {id: 1, title: 'listitem-a'},
  queue: { items: [
    {id: 2, title: 'listitem-b'},
    {id: 3, title: 'listitem-c'}
  ]}
};

test('it renders', function(assert) {
  this.render(hbs`{{player-queue}}`);

  assert.ok(this.$('.player-queue').length, 'should render');
});

test('it renders with an empty queue', function(assert) {
  this.set('audio', emptyQueue);
  this.render(hbs`{{player-queue audio=audio}}`);

  assert.notOk(this.$('.list-item').length, 'should not render any queue list items');
  assert.ok(this.$('.queuelist-empty').length, 'should render an empty queue message div');
});

test('it renders a list of items', function(assert) {
  this.set('audio', queueWithItems);
  this.render(hbs`{{player-queue audio=audio}}`);

  assert.equal(this.$('.list-item').length, 3, 'should render list items');
  assert.ok(this.$('.list-item:contains(listitem-a)').length, 'should render title of list item 1');
  assert.ok(this.$('.list-item:contains(listitem-b)').length, 'should render title of list item 2');
  assert.ok(this.$('.list-item:contains(listitem-c)').length, 'should render title of list item 3');
  assert.notOk(this.$('.queuelist-empty').length, 'should not render an empty queue message div');
});

test('it renders the now playing item when playing from queue', function(assert) {
  this.set('audio', nowPlayingWithItems);
  this.render(hbs`{{player-queue audio=audio playingFromQueue=true}}`);

  assert.equal(this.$('.list-item[data-test-name="now-playing-item"]').length, 1, 'should render one now playing item');
  assert.equal(this.$('.list-item[data-test-name="now-playing-item"]:contains(listitem-a)').length, 1, 'should render title of the now playing item');
  assert.ok(this.$('.list-item:contains(listitem-b)').length, 'should render title of list item 2');
  assert.ok(this.$('.list-item:contains(listitem-c)').length, 'should render title of list item 3');
});

test('it does not render the now playing item when not playing from queue', function(assert) {
  this.set('audio', nowPlayingWithItems);
  this.render(hbs`{{player-queue audio=audio playingFromQueue=false}}`);

  assert.equal(this.$('.list-item[data-test-name="now-playing-item"]').length, 0, 'should not render now playing item');
});

test('it does not render the empty message when list is empty but now playing from queue', function(assert) {
  this.set('audio', nowPlayingEmpty);
  this.render(hbs`{{player-queue audio=audio playingFromQueue=true}}`);

  assert.equal(this.$('.list-item[data-test-name="now-playing-item"]').length, 1, 'should render now playing item');
  assert.notOk(this.$('.queuelist-empty').length, 'should not render an empty queue message div');
});

test('it should call removeFromQueue action with the correct id', function(assert) {
  assert.expect(1);
  let myQueueWithItems = copy(queueWithItems);
  myQueueWithItems.removeFromQueue = function(id) {
     assert.equal(id, 2, 'should pass 2nd item id');
  };

  this.set('audio', myQueueWithItems);
  this.render(hbs`{{player-queue audio=audio}}`);

  this.$('.queueitem-deletebutton')[1].click();
});
