import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model() {
    return this.modelFor('discover');
  },
  actions: {
    next(selectedTopics) {
      this.send('saveTopics', selectedTopics);
      this.transitionTo('discover.shows');
    }
  }
});
