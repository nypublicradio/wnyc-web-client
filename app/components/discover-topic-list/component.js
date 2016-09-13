import Component from 'ember-component';
import { once } from 'ember-runloop';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/get';

export default Component.extend({
  classNames:['discover-topic-list'],
  topics: [],
  topicTags:  Ember.computed.mapBy('topics', 'url'),
  selectedTopicTags: [],
  metrics: service();

  allSelected: Ember.computed('selectedTopicTags.length', 'topicTags.length', function() {
    return get(this, 'topics').slice().length === get(this, 'selectedTopicTags').length;
  }),

  initializeTopics: Ember.on('init', function() {
    this.updateTopics((get(this, 'selectedTopicTags') || []));
  }),

  updateTopics(topics) {
    once(() => {
      set(this, 'selectedTopicTags', topics.slice());
      // don't want this bound to the session stuff passed in or saving gets hinky

      this.sendAction('onNoneSelected', topics.length === 0);
      this.sendAction('onTopicsUpdated', topics);
    });
  },

  actions: {
    selectAll() {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Selected All Topics',
      });
      this.updateTopics(get(this, 'topicTags'));
    },
    selectNone() {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Cleared All Topics',
      });
      this.updateTopics([]);
    },
    onMultiselectChangeEvent(selectedTopics, value, action) {
      let topics = get(this, 'selectedTopicTags');

      if (action === 'added') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Selected Topic',
          label: value.title
        });
        topics.addObject(value);
      }
      else if (action === 'removed') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Deselected Topic',
          label: value.title
        });
        topics.removeObject(value);
      }

      this.updateTopics(topics);
    }
  }
});
