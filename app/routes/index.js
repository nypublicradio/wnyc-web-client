import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  audio:      service(),
  classNames: ['home'],

  model() {
    return this.get('store').findRecord('bucket', 'wqxr-home').then(bucket => {
      return {
        featuredItems: bucket.get('bucketItems').slice(0, 8),
        otherItems: bucket.get('bucketItems').slice(8)
      };
    });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
    controller.set('streams', this.store.findAll('stream'))
  }
});
