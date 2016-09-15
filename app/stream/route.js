import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  audio: service(),

  model() {
    return this.store.findAll('stream');
  },

  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
  }
});
