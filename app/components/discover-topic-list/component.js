import { once } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import Component from '@ember/component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  metrics: service(),
  classNames:['discover-topic-list'],
  topics: [],
  topicTags:  mapBy('topics', 'url'),
  selectedTopicTags: [],

  allSelected: computed('selectedTopicTags.length', 'topicTags.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopicTags').length;
  }),

  initializeTopics: on('init', function() {
    this.updateTopics((this.get('selectedTopicTags') || []));
  }),

  updateTopics(topics) {
    once(() => {
      this.set('selectedTopicTags', topics.slice());
      // don't want this bound to the session stuff passed in or saving gets hinky

      this.sendAction('onNoneSelected', topics.length === 0);
      this.sendAction('onTopicsUpdated', topics);
    });
  },

  actions: {
    selectAll() {
      get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'Discover',
        action: 'Selected All Topics',
      });

      this.updateTopics(this.get('topicTags'));
    },
    selectNone() {
      get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'Discover',
        action: 'Cleared All Topics',
      });

      this.updateTopics([]);
    },
    onMultiselectChangeEvent(selectedTopics, value, action) {
      let topics = this.get('selectedTopicTags');
      let topic = get(this, 'topics').findBy('url', value);
      let title = get(topic, 'title');

      if (action === 'added') {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'Discover',
          action: 'Selected Topic',
          label: title
        });

        topics.addObject(value);
      }
      else if (action === 'removed') {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'Discover',
          action: 'Deselected Topic',
          label: title
        });

        topics.removeObject(value);
      }

      this.updateTopics(topics);
    }
  }
});
