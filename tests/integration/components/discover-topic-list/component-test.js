import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover topic list', function(hooks) {
  setupRenderingTest(hooks);

  const topics = [
    {id: 1, url: 'a-m', title: "Music"},
    {id: 2, url: 'a-a', title: "Arts"},
    {id: 3, url: 'a-f', title: "Food"},
    {id: 4, url: 'a-d', title: "Dreams"},
    {id: 5, url: 'a-s', title: "Sleep"}
  ];

  test('it renders', async function(assert) {
    this.set('topics', topics);
    await render(hbs`{{discover-topic-list topics=topics}}`);
    assert.equal(findAll('.discover-topic').length, 5);
  });

  test('select all selects all topics', async function(assert) {
    this.set('topics', topics);
    await render(hbs`{{discover-topic-list topics=topics onTopicsUpdated=(action (mut currentlySelectedTopics))}}`);

    this.$('button').click();
    assert.equal(this.get('currentlySelectedTopics').length, this.get('topics').length);
  });

  test('clear all selects none', async function(assert) {
    this.set('topics', topics);
    await render(hbs`{{discover-topic-list topics=topics onTopicsUpdated=(action (mut currentlySelectedTopics))}}`);

    this.$('button').click();
    this.$('button').click();
    assert.equal(this.get('currentlySelectedTopics').length, 0);
  });

  test('Clear All only shows up when all are selected', async function(assert) {
    this.set('topics', topics.slice(0, 3));
    await render(hbs`{{discover-topic-list topics=topics}}`);

    this.$('.discover-topic')[0].click();
    assert.equal(this.$('button').length, 0, "Should be 'Select All' when not all are selected");

    this.$('.discover-topic')[1].click();
    assert.equal(this.$('button').length, 0, "Should be 'Select All' when not all are selected");

    this.$('.discover-topic')[2].click();
    assert.equal(this.$('button').length, 1, "Should be 'Clear All' when all are selected");
  });

  test('passing in selected topics renders selected items', async function(assert) {
    this.set('topics', topics);
    this.set('selectedTopicTags', [topics[1].url, topics[2].url]);
    await render(hbs`{{discover-topic-list topics=topics selectedTopicTags=selectedTopicTags}}`);
    assert.equal(findAll('input[type=checkbox]:checked').length, 2);
  });

  test('clicking on a topic sends an updated topics list', async function(assert) {
    this.set('topics', topics);
    this.set('selectedTopicTags', [topics[1].url, topics[2].url]);
    this.set('currentlySelectedTopics', []);
    await render(
      hbs`{{discover-topic-list topics=topics selectedTopicTags=selectedTopicTags onTopicsUpdated=(action (mut currentlySelectedTopics))}}`
    );

    assert.equal(this.get('currentlySelectedTopics').length, 2, "should get updated on render");

    this.$('.discover-topic')[1].click();
    assert.equal(this.get('currentlySelectedTopics').length, 1, "should be updated when topics change");
  });
});
