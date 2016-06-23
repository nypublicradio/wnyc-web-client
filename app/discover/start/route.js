import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

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
  actions: {
    next() {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'topics');
      prefs.save();

      this.transitionTo('discover.topics');
    }
  }
});
