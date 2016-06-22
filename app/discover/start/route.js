import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touch);
    controller.set('isAndroid', /Android/i.test(window.navigator.userAgent));
  },
  actions: {
    next() {
      this.transitionTo('discover.topics');
    }
  }
});
