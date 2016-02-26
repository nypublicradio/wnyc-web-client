import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Mixin,
  get,
  run
} = Ember;

export default Mixin.create({
  metrics: service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
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
