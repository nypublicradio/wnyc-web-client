import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  audio: service(),
  googleAds: service(),
  titleToken: 'Listen Live to WQXR, Q2, Operavore, and the Jonathan Channel',

  model() {
    return this.store.findAll('stream').then(streams => {
      return streams.filterBy('liveWQXR'); 
    });
  },

  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
  },
  
  actions: {
    didTransition() {
      this.get('googleAds').refresh();
    }
  }
});
