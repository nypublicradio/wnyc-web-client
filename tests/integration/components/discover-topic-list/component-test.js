import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-topic-list', 'Integration | Component | discover topic list', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {
  this.set('topics', server.createList('discover-topic', 20));
  this.render(hbs`{{discover-topic-list topics=topics}}`);
  assert.equal(this.$('.discover-topic').length, 20);
});

test('select all selects all topics', function(assert) {
  this.set('topics', server.createList('discover-topic', 20));
  this.render(hbs`{{discover-topic-list topics=topics onTopicsUpdated=(action (mut currentlySelectedTopics))}}`);

  this.$('a:contains("Select All")').click();
  assert.equal(this.get('currentlySelectedTopics').length, this.get('topics').length);
});

test('select none selects none', function(assert) {
  this.set('topics', server.createList('discover-topic', 20));
  this.render(hbs`{{discover-topic-list topics=topics onTopicsUpdated=(action (mut currentlySelectedTopics))}}`);

  this.$('a:contains("Select All")').click();
  this.$('a:contains("Select None")').click();
  assert.equal(this.get('currentlySelectedTopics').length, 0);
});

test('select none only shows up when all are selected', function(assert) {
  this.set('topics', server.createList('discover-topic', 3));
  this.render(hbs`{{discover-topic-list topics=topics}}`);

  this.$('.discover-topic')[0].click();
  assert.equal(this.$('a:contains("Select None")').length, 0, "Should be 'Select All' when not all are selected");

  this.$('.discover-topic')[1].click();
  assert.equal(this.$('a:contains("Select None")').length, 0, "Should be 'Select All' when not all are selected");

  this.$('.discover-topic')[2].click();
  assert.equal(this.$('a:contains("Select None")').length, 1, "Should be 'Select None' when all are selected");
});

test('passing in selected topics renders selected items', function(assert) {
  let topics = server.createList('discover-topic', 5);
  this.set('topics', topics);
  this.set('selectedTopics', [topics[1], topics[2]]);
  this.render(hbs`{{discover-topic-list topics=topics selectedTopics=selectedTopics}}`);
  assert.equal(this.$('input[type=checkbox]:checked').length, 2);
});

test('clicking on a topic sends an updated topics list', function(assert) {
  let topics = server.createList('discover-topic', 5);
  this.set('topics', topics);
  this.set('selectedTopics', [topics[1], topics[2]]);
  this.set('currentlySelectedTopics', []);
  this.render(hbs`{{discover-topic-list topics=topics selectedTopics=selectedTopics onTopicsUpdated=(action (mut currentlySelectedTopics))}}`);

  assert.equal(this.get('currentlySelectedTopics').length, 2, "should get updated on render");

  this.$('.discover-topic')[1].click();
  assert.equal(this.get('currentlySelectedTopics').length, 1, "should be updated when topics change");
});
