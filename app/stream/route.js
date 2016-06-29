import Route from 'ember-route';
import service from 'ember-service/inject';
import rsvp from 'rsvp';
const { hash } = rsvp;

export default Route.extend({
  audio: service(),

  model() {
    return hash({
      page: this.store.findRecord('django-page', 'streams/'),
      streams: this.store.findAll('stream')
    });
  },

  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
  }
});
