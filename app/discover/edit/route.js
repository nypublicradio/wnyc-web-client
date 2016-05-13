import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  beforeModel() {
    this.replaceWith('discover.edit.topics');
  },
  actions: {
    refresh() {
      this.send('saveTopics', this.controllerFor('discover.edit.topics').get('currentTopicSelection'));
      this.transitionTo('discover.index');
    }
  }
});
