import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.findAll('shows').then((shows) => {
      prefs.setDefaultShows(shows.mapBy('slug'));
      return Ember.RSVP.hash({
        shows: shows,
        selectedShowSlugs: prefs.get('selectedShowSlugs')
      });
    });
  },

  actions: {
    back(selectedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'topics');
      prefs.set('selectedShowSlugs', selectedShowSlugs);
      this.transitionTo('discover.topics');
    },
    next(selectedShowSlugs) {
      if (selectedShowSlugs.length === 0) {
        this.controllerFor('discover.shows').set('showError', true);
      }
      else {
        this.controllerFor('discover.shows').set('showError', false);
        let prefs = this.get('discoverPrefs');
        prefs.set('selectedShowSlugs', selectedShowSlugs);
        prefs.set('setupComplete', true);
        prefs.save();

        this.transitionTo('discover.index');
      }
    }
  }
});
