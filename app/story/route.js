import Route from '@ember/routing/route';
import { hash as waitFor } from 'rsvp';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import config from 'wnyc-web-client/config/environment';
import { schedule } from '@ember/runloop';

export default Route.extend(PlayParamMixin, {
  session:      service(),
  googleAds:    service(),
  dataPipeline: service(),
  currentUser:  service(),
  dataLayer:    service('nypr-metrics/data-layer'),

  titleToken({ story }) {
    return [
      get(story, 'title'),
      get(story, 'showTitle') || get(story, 'channelTitle') || 'NPR Article?'
    ]
  },
  model({ slug }, { queryParams }) {

    return this.store.findRecord('story', slug, {adapterOptions: {queryParams}}).then(story => {
      let comments = this.store.query('comment', { itemTypeId: story.get('itemTypeId'), itemId: story.get('cmsPK') });
      let relatedStories = this.store.query('story', {related: { itemId: story.get('cmsPK'), limit: 5 }});

      return waitFor({
        story,
        getComments: () => comments,
        getRelatedStories: () => relatedStories,
        adminURL: `${config.adminRoot}/admin`
      });
    });
  },
  afterModel({ story }, transition) {
    get(this, 'googleAds').doTargeting(story.forDfp());

    if (get(story, 'headerDonateChunk')) {
      transition.send('updateDonateChunk', get(story, 'headerDonateChunk'));
    }
    get(this, 'dataLayer').setForType('story', story);

    schedule('afterRender', () => {
      // data pipeline
      get(this, 'dataPipeline').reportItemView({
        cms_id: get(story, 'cmsPK'),
        item_type: get(story, 'itemType'),
      });
    });
  },

  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touchevents);
    controller.set('session', get(this, 'session'));
    controller.set('user', get(this, 'currentUser.user'));

    return this._super(...arguments);
  },

  renderTemplate(controller, model) {
    if (get(model, 'story.template') === 'story_full-bleed') {
      this.send('disableChrome');
      this.render('full-bleed');
    } else {
      this._super(...arguments);
    }
  },

  actions: {
    willTransition() {
      this.send('enableChrome');
      get(this, 'dataLayer').clearForType('story');
    }
  }
});
