import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model() {
    return this.modelFor('discover');
  },
  actions: {
    next(selectedTopics) {
      if (selectedTopics.length === 0) {
        this.controllerFor('discover.topics').set('showError', true);
      }
      else {
        this.controllerFor('discover.topics').set('showError', false);
        this.send('saveTopics', selectedTopics);
        this.transitionTo('discover.shows');
      }
    }
  }
});
