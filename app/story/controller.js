import { scheduleOnce } from '@ember/runloop';
import Controller from '@ember/controller';


export default Controller.extend({
  queryParams:  ['tab'],
  tab: null,

  setTab(){
    if (location.hash.substr(1) === "transcript"){
      this.set("tab", 'transcript');
    }
  },

  init(){
    this._super(...arguments);
    scheduleOnce("afterRender", this, this.setTab);
    this.set('deviceIsIos', !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
  },
});
