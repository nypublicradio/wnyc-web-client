import Mixin from 'ember-metal/mixin';
import { scheduleOnce } from 'ember-runloop';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Mixin.create({
  metrics: service(),

  didTransition([ applicationTransition ]) {
    let { controller } = applicationTransition.handler;
    if (!controller._wasModal) {
      this._trackPage();
    }
    controller._wasModal = false;
      
    let ret = this._super(...arguments);
    return ret === false ? ret : true;
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const metrics = get(this, 'metrics');
      const page = document.location.pathname; // e.g. '/shows/bl/'
      const title = document.title; // this should be something dynamic

      metrics.trackPage({ page, title });
    });
  },
});
