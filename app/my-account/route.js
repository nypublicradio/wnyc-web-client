import Route from 'ember-route';

export default Route.extend({
  setupController() {
    this.send('disableChrome');
  },
  actions: {
    willTransition(transition) {
      if (!transition.targetName.startsWith('accounts')) {
        this.send('enableChrome');
      }
    }
  }
});
