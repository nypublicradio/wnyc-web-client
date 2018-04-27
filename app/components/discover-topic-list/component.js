import { once } from '@ember/runloop';
import { computed } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  metrics: service(),
  classNames:['discover-topic-list'],
  topicTags:  mapBy('topics', 'url'),

  allSelected: computed('selectedTopicTags.length', 'topicTags.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopicTags').length;
  }),

  init() {
    this._super(...arguments);
    this.setProperties({
      topics: this.topics || [],
      selectedTopicTags: this.selectedTopicTags || [],
    });
    this.updateTopics(this.selectedTopicTags);
  },

  updateTopics(topics) {
    once(() => {
      this.set('selectedTopicTags', topics.slice());
      // don't want this bound to the session stuff passed in or saving gets hinky

      /* eslint-disable */
      this.sendAction('onNoneSelected', topics.length === 0);
      this.sendAction('onTopicsUpdated', topics);
      /* eslint-enable */
    });
  },

  actions: {
    selectAll() {
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
