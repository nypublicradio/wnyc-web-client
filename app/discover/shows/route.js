import Ember from 'ember';
import ENV from '../../config/environment';
import get from 'ember-metal/get';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),
  metrics: Ember.inject.service(),
  titleToken: 'Discover Select Shows',

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('shows', {
      discover_station: ENV.discoverStation,
      api_key: ENV.discoverAPIKey
    }).then((shows) => {
      return Ember.RSVP.hash({
        shows: shows,
        excludedShowSlugs: prefs.get('excludedShowSlugs')
      });
    });
  },
  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('loadingDirection', null);
  },

  actions: {
    back(excludedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'topics');
      prefs.set('excludedShowSlugs', excludedShowSlugs);

      this.controller.set('loadingDirection', 'back');
      this.transitionTo('discover.topics');
    },
    next(excludedShowSlugs, hasNotSelectedShow) {
      if (hasNotSelectedShow) {
        this.controller.set('showError', true);
      }
      else {
        this.controller.setProperties({showError: false, loadingDirection: 'next'});
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Create Playlist in Discover'
        });

        this.controllerFor('discover.shows').set('showError', false);
        let prefs = this.get('discoverPrefs');
        prefs.set('excludedShowSlugs', excludedShowSlugs);
        prefs.set('setupComplete', true);
        prefs.save();

        this.transitionTo('discover.index');
      }
    }
  }
});
