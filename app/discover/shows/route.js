import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('shows', {
      discover_station: 'wnyc_v2',
      api_key: 'trident'
    }).then((shows) => {
      return Ember.RSVP.hash({
        shows: shows,
        excludedShowSlugs: prefs.get('excludedShowSlugs')
      });
    });
  },

  actions: {
    back(excludedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'topics');
      prefs.set('excludedShowSlugs', excludedShowSlugs);
      this.transitionTo('discover.topics');
    },
    next(excludedShowSlugs, hasNotSelectedShow) {
      if (hasNotSelectedShow) {
        this.controllerFor('discover.shows').set('showError', true);
      }
      else {
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
