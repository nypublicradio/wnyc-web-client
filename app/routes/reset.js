import Route from 'ember-route';

export default Route.extend({
  queryParams: ['email', 'confirmation'],
  email: null,
  confirmation: null,
  setupController() {
    this.send('disableChrome');
  },
  actions: {
    willTransition() {
      this.send('enableChrome');
    }
  }
});
