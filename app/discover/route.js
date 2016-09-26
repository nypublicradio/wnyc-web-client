import Ember from 'ember';
import ENV from '../config/environment';
import { inExperimentalGroup } from 'overhaul/helpers/in-experimental-group';

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service('discover-queue'),
  discoverPrefs: Ember.inject.service(),

  setupController(controller) {
    // Don't use liquid fire in testing until we figure out why
    // it makes acceptance tests fail

    controller.set('useLiquid', ENV.environment !== 'testing');
  },
  beforeModel() {
    if (window.Modernizr.touch) {
      // Show download links
      this.replaceWith('discover.start');
    }
  },
  redirect() {
    // Google Experiment D4W - START
    if (!( inExperimentalGroup([1]) || inExperimentalGroup([2]) )) {
      this.transitionTo('index');
    }
    // Google Experiment D4W - END
  },
  activate(){
    window.scrollTo(0,0);
  },
  actions: {
    resetPlaylist() {
      this.get('discoverQueue').emptyQueue();
    }
  }
});
