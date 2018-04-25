import Mixin from '@ember/object/mixin';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';

const DETAIL_ROUTES = new RegExp(/story|(show|article|series|tag|blog)-detail\./);

export default Mixin.create({
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
      if (!DETAIL_ROUTES.test(this.currentRouteName) && !this.currentRouteName.match(/loading/)) {
        this.get('dataPipeline').reportItemView();
      }
    });
  },
});
