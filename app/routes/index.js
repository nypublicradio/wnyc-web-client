import Route from 'ember-route';
import service from 'ember-service/inject';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import DS from 'ember-data';
import RSVP from 'rsvp';

const carouselBg = 'https://images.unsplash.com/photo-1481462585914-9f695507135e?dpr=2&auto=format&fit=crop&w=1500&h=1500&q=80&cs=tinysrgb';

export default Route.extend(PlayParamMixin, {
  audio:      service(),
  classNames: ['home'],

  model() {
    return RSVP.hash({
      wartopChunk: this.store.findRecord('chunk', 'wqxr-wartop-home').catch(()=>''),
      membershipChunk: this.store.findRecord('chunk', 'wqxr-membership-home').catch(() => ''),
      featuredItems: this.store.findRecord('bucket', 'wqxr-home').then(b => b.get('bucketItems').slice(0, 8)),
      otherItems: this.store.findRecord('bucket', 'wqxr-home').then(b => b.get('bucketItems').slice(8))
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    let streams = DS.PromiseArray.create({
      promise: this.store.findAll('stream', {reload: true}).then(s => {
        return s.filterBy('liveWQXR').concat(s.filterBy('isWNYC'));
      })
    });
    controller.set('streams', streams);
    controller.set('carouselBg', carouselBg);
    controller.set('audio', this.get('audio'));
  }
});
