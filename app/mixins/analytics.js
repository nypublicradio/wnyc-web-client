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
      const page = document.location.pathname // e.g. '/shows/bl/'
      const title = document.title // this should be something dynamic

      // TODO: assess what should be sent for listing views for trackPage events
      // TODO: story items send 'Web Page' to GA/DW as the category, but pledge
      // sends _trackPageview as the cateogry to DW. how to resolve
      metrics.trackPage({ page, title })
    })
  },
});
