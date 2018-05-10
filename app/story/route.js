import Route from '@ember/routing/route';
import { hash as waitFor } from 'rsvp';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import config from 'wqxr-web-client/config/environment';

export default Route.extend(PlayParamMixin, {
  metrics:      service(),
  session:      service(),
  googleAds:    service(),
  dataPipeline: service(),
  currentUser:  service(),

  titleToken(model) {
    return `${get(model, 'story.title')} - ${get(model, 'story.headers.brand.title')}`;
  },
  title(tokens) {
    return `${tokens[0]} - WQXR`;
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
  afterModel(model, transition) {
    get(this, 'googleAds').doTargeting(get(model, 'story').forDfp());

    if (get(model, 'story.headerDonateChunk')) {
      transition.send('updateDonateChunk', get(model, 'story.headerDonateChunk'));
    }
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
      let image = get(model, 'story.imageMain');
      // This logic is yields three cases corresponding to the three possible full-bleed template layouts:
      // Big lead image, small lead image, and no lead image. If there is an image, and the width is big enough,
      // don't show additional share links or the small lead image. If there is an image but it's small, show
      // both the additional share links and the small lead. If there is no lead image, show only the additional share links.
      if (image){
        controller.set('showSmallLead', image.w < 1440);
        controller.set('showShareLinks', image.w < 1440);
      } else {
        controller.set('showSmallLead', false);
        controller.set('showShareLinks', true);
      }
      this.render('full-bleed');
    } else {
      this._super(...arguments);
    }
  },

  actions: {
    error(error){
      //detect 404 error on api
      if (error.errors && error.errors[0].status === '404'){
        this.transitionTo('missing');
      }
    },

    didTransition() {
      this._super(...arguments);

      let model = get(this, 'currentModel');
      let metrics = get(this, 'metrics');
      let dataPipeline = get(this, 'dataPipeline');
      let {containers:action, title:label} = get(model, 'story.analytics');
      let nprVals = get(model, 'story.nprAnalyticsDimensions');

      // google analytics
      metrics.trackEvent('GoogleAnalytics', {
        category: 'Viewed Story',
        action,
        label,
      });



      // NPR
      metrics.trackPage('NprAnalytics', {
        page: `/story/${get(model, 'story.slug')}`,
        title: label,
        nprVals,
      });

      // data pipeline
      dataPipeline.reportItemView({
        cms_id: get(model, 'story.cmsPK'),
        item_type: get(model, 'story.itemType'),
      });

      return true;
    },

    willTransition() {
      this.send('enableChrome');
      if (window.dataLayer) {
        window.dataLayer.push({showTitle: undefined});
      }
    }
  }
});
