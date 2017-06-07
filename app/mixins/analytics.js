import Mixin from 'ember-metal/mixin';
import { scheduleOnce } from 'ember-runloop';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

const DETAIL_ROUTES = new RegExp(/story|(show|article|series|tag|blog)-detail\./);

export default Mixin.create({
  metrics: service(),
  dataPipeline: service(),

  willTransition() {
    this.set('dataPipeline.currentReferrer', window.location.toString());

    let ret = this._super(...arguments);
    return ret === false ? ret : true;
  },

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
      let page;
      let is404 = this.currentRouteName === 'missing';
      let title = document.title;
      const metrics = get(this, 'metrics');
      if (is404) {
        page = this.get('dataPipeline.currentReferrer').replace(/http:\/\/[^/]+/, '');
      } else {
        page = document.location.pathname + document.location.search; // e.g. '/shows/bl/?q=foo'
      }

      metrics.trackPage('GoogleAnalytics', { page, title });
      metrics.trackPage('GoogleTagManager', { page, title });
      
      if (!DETAIL_ROUTES.test(this.currentRouteName) && !this.currentRouteName.match(/loading/)) {
        this.get('dataPipeline').reportItemView();
      }
    });
  },
});
