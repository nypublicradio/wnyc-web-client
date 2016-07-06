import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Mixin,
  get,
  run
} = Ember;

export default Mixin.create({
  metrics: service(),

  didTransition([ applicationTransition ]) {
    let { controller } = applicationTransition.handler;
    this._super(...arguments);

    if (!controller._wasModal) {
      this._trackPage();
    }
    controller._wasModal = false;
  },

  _trackPage() {
    run.scheduleOnce('afterRender', this, () => {
      const metrics = get(this, 'metrics');
      const page = document.location.pathname; // e.g. '/shows/bl/'
      const title = document.title; // this should be something dynamic

      metrics.trackPage({ page, title });
    });
  },
});
