import Route from 'ember-route';
import service from 'ember-service/inject';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';

const carouselBg = 'https://images.unsplash.com/photo-1481462585914-9f695507135e?dpr=2&auto=format&fit=crop&w=1500&h=1500&q=80&cs=tinysrgb';

export default Route.extend(PlayParamMixin, {
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
    controller.set('streams', this.store.findAll('stream', {reload: true}));
    controller.set('carouselBg', carouselBg);
  }
});
