import Ember from 'ember';

export default Ember.Component.extend({
  selectedTopics:[],
  allSelected: Ember.computed('selectedTopics.length', 'topics.length', function() {
    return this.get('topics').slice().length === this.get('selectedTopics').length;
  }),
  actions: {
    selectAll() {
      this.set('selectedTopics', this.get('topics').slice());
      // .slice() to make sure we don't make these the *same*, because then things get weird
    },
    selectNone() {
      this.set('selectedTopics', []);
    }
  }
});
