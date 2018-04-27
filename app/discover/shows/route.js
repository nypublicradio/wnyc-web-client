import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from '../../config/environment';

export default Route.extend({
  session: service(),
  discoverPrefs: service(),
  titleToken: 'Discover Select Shows',

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('show', {
      discover_station: ENV.discoverStation,
      api_key: ENV.discoverAPIKey,
      'fields[show]': 'slug,title,image'
    }).then((shows) => {
      return hash({
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
