import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  beforeModel() {
    // look at session data and redirect to start if there are no selected topics
    // and shows
    if (!this.get('session.data.discover-topics') && !this.get('session.data.discover-topics')) {
      this.replaceWith('discover.start');
    }
  }
});
