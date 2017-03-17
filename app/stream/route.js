import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  audio: service(),
  titleToken: 'Listen Live to WNYC, WQXR, Q2, Operavore, NJPR, and the Jonathan Channel',

  model() {
    return this.store.findAll('stream');
  },

  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
  },
});
