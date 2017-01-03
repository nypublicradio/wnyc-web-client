import Route from 'ember-route';
import service from 'ember-service/inject';
import Ember from 'ember';
const {
  Inflector,
  get,
  set
} = Ember;
const { hash: waitFor } = Ember.RSVP;
const inflector = new Inflector(Inflector.defaultRules);
import { retryFromServer } from 'overhaul/lib/compat-hooks';
import PlayParamMixin from 'overhaul/mixins/play-param';

export default Route.extend(PlayParamMixin, {
  session: service(),
  metrics: service(),
  currentUser: service(),

  model(params) {
    const channelType = this.routeName;
    const listingSlug = `${inflector.pluralize(channelType)}/${params.slug}`;
    set(this, 'listingSlug', listingSlug);

    return this.store.find('django-page', listingSlug.replace(/\/*$/, '/')).then(page => {
      return waitFor({
        page,
        channel: page.get('wnycChannel'),
        user: this.get('currentUser.user')
      });
    })
    .catch(e => retryFromServer(e, listingSlug.replace(/\/*$/, '/')));
  },
  afterModel({ channel }) {
    const channelTitle = get(channel, 'title');
    const metrics = get(this, 'metrics');
    const nprVals = get(channel, 'nprAnalyticsDimensions');

    if (channel.get('headerDonateChunk')) {
      this.send('updateDonateChunk', channel.get('headerDonateChunk'));
    }

    metrics.trackEvent({
      category: `Viewed ${get(channel, 'listingObjectType').capitalize()}`,
      action: channelTitle,
      id: channel.get('cmsPK'),
      type: channel.get('listingObjectType')
    });

    metrics.invoke('trackPage', 'NprAnalytics', {
      page: `/${get(this, 'listingSlug')}`,
      title: channelTitle,
      nprVals,
      isNpr: true
    });
  },
  setupController(controller, model) {
    let { navSlug } = this.paramsFor(`${this.routeName}.well`);
    controller.setProperties({
      channelType: this.routeName,
      navRoot: get(this, 'listingSlug'),
      defaultSlug: navSlug,
      model
    });
  }
});
