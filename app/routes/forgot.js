import Route from 'ember-route';

export default Route.extend({
  setupController() {
    this.send('disableChrome');
  },
  actions: {
    willTransition() {
      this.send('enableChrome');
    }
  }
});
