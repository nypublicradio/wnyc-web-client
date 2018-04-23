import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import DS from 'ember-data';
import RSVP from 'rsvp';

const STREAM_BG = '/assets/img/backgrounds/streambanner.jpg';

export default Route.extend(PlayParamMixin, {
  googleAds:  service(),
  classNames: ['home'],
  dj: service(),

  model() {
    get(this, 'googleAds').doTargeting();

    return RSVP.hash({
      wqxrHome: this.store.findRecord('bucket', 'wqxr-home').then(b => {
        return {
          featuredItems: b.get('bucketItems').slice(0, 9),
          otherItems: b.get('bucketItems').slice(9)
        };
      }),
      wartopChunk: this.store.findRecord('chunk', 'wqxr-wartop-home').catch(()=>''),
      membershipChunk: this.store.findRecord('chunk', 'wqxr-membership-home').catch(() => ''),
    });
  },

  setupController(controller) {
    this._super(...arguments);
    let streams = DS.PromiseArray.create({
      promise: this.store.findAll('stream', {reload: true}).then(s => {
        return s.filterBy('liveWQXR').sortBy('sitePriority')
          .concat(s.filterBy('isWNYC').sortBy('sitePriority')).uniq();
      })
    });
    controller.set('streams', streams);
    controller.set('background', STREAM_BG);
  }
});
