import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-topic-list'],

  selectedTopics: [],

  allSelected: Ember.computed('selectedTopics', 'topics.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopics').length;
  }),

  initializeTopics: Ember.on('init', function() {
    this.updateTopics((this.get('selectedTopics') || []));
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
