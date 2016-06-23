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
      // prefs.loadFromSession(); // we want the saved data, not the temp data

      // yo, get back to the setup flow
      // but where we at?
      // look at session data and redirect to start if there are no selected topics

      this.transitionTo(`discover.${prefs.get('currentSetupStep')}`);

      // if (transition.targetName === 'discover.start') {
      //   // we clicked on the side bar
      //   this.transitionTo('discover.start');
      // }
      // else if (prefs.get('selectedTopicTags').length === 0) {
      //   this.replaceWith('discover.start');
      // }
      // else if (prefs.get('selectedShowSlugs').length === 0) {
      //   this.replaceWith('discover.shows');
      // }
    }
    else if (transition.targetName === 'discover.start'){
      // we clicked on the side bar
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
