import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from '../../config/environment';

export default Route.extend({
  session: service(),
  discoverPrefs: service(),
  titleToken: 'Discover Select Topics',

  model() {
    return hash({
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

        this.controllerFor('discover.topics').set('showError', false);
        prefs.set('selectedTopicTags', selectedTopicTags);
        prefs.set('currentSetupStep', 'shows');
        prefs.save();

        this.transitionTo('discover.shows');
      }
    }
  }
});
