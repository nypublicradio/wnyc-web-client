import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-topic-list'],
  topics: [],
  topicTags:  Ember.computed.mapBy('topics', 'url'),
  selectedTopicTags: [],

  allSelected: Ember.computed('selectedTopicTags.length', 'topicTags.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopicTags').length;
  }),

  initializeTopics: Ember.on('init', function() {
    this.updateTopics((this.get('selectedTopicTags') || []));
  }),

  updateTopics(topics) {
    Ember.run.once(() => {
      this.set('selectedTopicTags', topics.slice());
      // don't want this bound to the session stuff passed in or saving gets hinky

      this.sendAction('onNoneSelected', topics.length === 0);
      this.sendAction('onTopicsUpdated', topics);
    });
  },

  actions: {
    selectAll() {
      this.updateTopics(this.get('topicTags'));
    },
    selectNone() {
      this.updateTopics([]);
    },
    onMultiselectChangeEvent(selectedTopics, value, action) {
      let topics = this.get('selectedTopicTags');

      if (action === 'added') {
        topics.addObject(value);
      }
      else if (action === 'removed') {
        topics.removeObject(value);
      }

      this.updateTopics(topics);
    }
  }
});
