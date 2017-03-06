import Route from 'ember-route';

export default Route.extend({
  setupController() {
    return this._super(...arguments);
  },
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
