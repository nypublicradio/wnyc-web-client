import Route from 'ember-route';

export default Route.extend({
  queryParams: ['email', 'confirmation'],
  email: null,
  confirmation: null,
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
