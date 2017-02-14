import Ember from 'ember';
import ENV from '../../config/environment';
import get from 'ember-metal/get';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),
  metrics: Ember.inject.service(),
  titleToken: 'Discover Select Topics',

  model() {
    return Ember.RSVP.hash({
      topics: this.store.query('discover.topics', {discover_station: ENV.discoverTopicsKey}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('loadingDirection', null);
  },

  actions: {
    back(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'start');
      prefs.set('selectedTopicTags', selectedTopicTags);

      this.controller.set('loadingDirection', 'back');
      this.transitionTo('discover.start');
    },
    next(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      if (selectedTopicTags.length === 0) {
        this.controller.set('showError', true);
      }
      else {
        this.controller.setProperties({showError: false, loadingDirection: 'next'});
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'Discover',
          action: 'Clicked Next in Discover'
        });

        this.controllerFor('discover.topics').set('showError', false);
        prefs.set('selectedTopicTags', selectedTopicTags);
        prefs.set('currentSetupStep', 'shows');
        prefs.save();

        this.transitionTo('discover.shows');
      }
    }
  }
});
