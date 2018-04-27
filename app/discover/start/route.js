import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  discoverPrefs: service(),

  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touchevents);
    controller.set('isAndroid', /Android/i.test(window.navigator.userAgent));
    return this._super(...arguments);
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
