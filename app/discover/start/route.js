import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touch);
    controller.set('isAndroid', /Android/i.test(window.navigator.userAgent));
  },
  redirect(/* model, transition */) {
    let prefs = this.get('discoverPrefs');
    if (!prefs.get('setupComplete')) {
      prefs.loadFromSession(); // we want the saved data, not the temp data

      // yo, get back to the setup flow
      // but where we at?
      // look at session data and redirect to start if there are no selected topics
      if (prefs.get('selectedTopicTags').length === 0) {
        this.replaceWith('discover.start');
      }
      else if (prefs.get('selectedShowSlugs').length === 0) {
        this.replaceWith('discover.shows');
      }
    }
    else {
      this.replaceWith('discover.index');
    }
  },
  actions: {
    next() {
      this.transitionTo('discover.topics');
    }
  }
});
