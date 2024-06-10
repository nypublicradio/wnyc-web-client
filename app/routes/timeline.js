import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
