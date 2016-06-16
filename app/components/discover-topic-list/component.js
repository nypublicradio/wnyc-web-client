import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-topic-list'],

  selectedTopics: [],

  allSelected: Ember.computed('selectedTopics.length', 'topics.length', function() {
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
