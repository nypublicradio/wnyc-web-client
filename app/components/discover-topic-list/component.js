import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  classNames:['discover-topic-list'],

  selectedTopics: [], // these are the models, and the multi-select checkbox
                      // component I used wants the models

  didReceiveAttrs() {
    this._super(...arguments);

    let selectedTopicTags = this.get('selectedTopicTags') || [];
    var selectedTopics = [];
    if (selectedTopicTags) {
      // Now we'll find the matching objects in the discover topics,
      // and add them to the selectedTopics list
      this.get('topics').forEach(function(topic) {
        if (selectedTopicTags.contains(get(topic, 'url'))) {
          selectedTopics.addObject(topic);
        }
      });
    }
    this.set('selectedTopics', selectedTopics);
  },

  allSelected: Ember.computed('selectedTopics.length', 'topics.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopics').length;
  }),

  initializeTopics: Ember.on('init', function() {
    this.updateTopics((this.get('selectedTopics') || []));
  }),

  updateTopics(topics) {
    Ember.run.once(() => {
      this.set('selectedTopics', topics);
      this.sendAction('onNoneSelected', topics.length === 0);
      this.sendAction('onTopicsUpdated', topics.mapBy('url'));
    });
  },

  actions: {
    selectAll() {
      this.updateTopics(this.get('topics').slice());
    },
    selectNone() {
      this.updateTopics([]);
    },
    onMultiselectChangeEvent(selectedTopics, changedTopics, action) {
      let topics = this.get('selectedTopics');

      if (action === 'added') {
        topics.addObject(changedTopics);
      }
      else if (action === 'removed') {
        topics.removeObject(changedTopics);
      }

      this.updateTopics(topics);
    }
  }
});
