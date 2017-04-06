import Route from 'ember-route';
import service from 'ember-service/inject';
<<<<<<< HEAD
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import DS from 'ember-data';
=======
import RSVP from 'rsvp';
>>>>>>> membership chunk rendering

const carouselBg = 'https://images.unsplash.com/photo-1481462585914-9f695507135e?dpr=2&auto=format&fit=crop&w=1500&h=1500&q=80&cs=tinysrgb';

export default Route.extend(PlayParamMixin, {
  audio:      service(),
  classNames: ['home'],

  model() {
    return RSVP.hash({
      membershipChunk: this.store.findRecord('chunk', 'wqxr-membership-home').catch(() => ''),
      gridItems: this.store.findRecord('bucket', 'wqxr-home').then(b => b.get('bucketItems'))
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
