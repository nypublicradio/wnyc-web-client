import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(...arguments);
    this.set('cssPath', 'assets/css/timeline.css')
  },
  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
