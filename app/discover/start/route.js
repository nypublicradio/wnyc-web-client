import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touch);
    controller.set('isAndroid', /Android/i.test(window.navigator.userAgent));
  },
  model() {
    return this.modelFor('discover');
  },
  actions: {
    next() {
      this.transitionTo('discover.topics');
    }
  }
});
