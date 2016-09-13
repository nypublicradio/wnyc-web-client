import Route from 'ember-route';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

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
      this.transitionTo(`discover.${prefs.get('currentSetupStep')}`);
    }
    else if (transition.targetName === 'discover.start'){
      // we clicked on the side bar, and setup is done. Go to the playlist
      this.replaceWith('discover.index');
    }
    else {
      // browsing direct, allow it
    }
  },
  afterModel() {
    get(this, 'metrics').trackEvent({
      category: 'Discover',
      action: 'Discover Entered'
    });
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

      this.transitionTo('discover.topics');
    }
  }
});
