import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  selectedTopics: [],

  init: function() {
    this._super(...arguments);
    var selectedTopics = [];
    let savedTopics = this.get('session.data.discover-topics');
    if (savedTopics) {

      // Now we'll find the matching objects in the discover topics,
      // and add them to the selectedTopics list
      this.get('topics').forEach(function(topic) {
        if (savedTopics.contains(topic.get('url'))) {
          selectedTopics.addObject(topic);
        }
      });
    }
    this.updateTopics(selectedTopics);
  },

  allSelected: Ember.computed('selectedTopics', 'topics.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopics').length;
  }),

  updateTopics(selectedTopics) {
    Ember.run.once(() => {
      this.set('selectedTopics', selectedTopics);
      this.sendAction('onNoneSelected', selectedTopics.length === 0);
      this.sendAction('onTopicsUpdated', selectedTopics);
    });
  },
  actions: {
    selectAll() {
      this.updateTopics(this.get('topics').slice());
    },
    selectNone() {
      this.updateTopics([]);
    },
    onMultiselectChangeEvent(selectedTopics /*, changedTopics, action */) {
      this.updateTopics(selectedTopics);
    }
  }
});
