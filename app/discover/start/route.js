import Route from 'ember-route';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { inExperimentalGroup } from 'overhaul/helpers/in-experimental-group';

export default Route.extend({
  discoverPrefs: service(),
  metrics: service(),

  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touch);
    controller.set('isAndroid', /Android/i.test(window.navigator.userAgent));
  },
  redirect(model, transition) {
    let prefs = this.get('discoverPrefs');

    if (!prefs.get('setupComplete')) {
      if (prefs.get('currentSetupStep') === 'start') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Discover Entered'
        });
      }
      this.transitionTo(`discover.${prefs.get('currentSetupStep')}`);
    }
    else if (transition.targetName === 'discover.start'){
      // we clicked on the side bar, and setup is done. Go to the playlist
      this.replaceWith('discover.index');
    }
    else {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Discover Entered'
      });
      // browsing direct, allow it
    }
  },
  actions: {
    next() {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Clicked Get Started'
      });
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'topics');
      prefs.save();

      // Google Experiment D4W - START
      if (inExperimentalGroup([1])) {
        this.transitionTo('discover.topics');
      } else if (inExperimentalGroup([2])) {
        this.transitionTo('discover.index');
      }
      // Google Experiment D4W - END
    }
  }
});
