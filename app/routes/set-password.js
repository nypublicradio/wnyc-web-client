import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
