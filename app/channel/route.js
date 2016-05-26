import Route from 'ember-route';
import service from 'ember-service/inject';
import Ember from 'ember';
const {
  get,
  set
} = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Route.extend({
  metrics: service(),

  model(params) {
    const channelType = this.routeName;
    const listingSlug = `${channelType}/${params.slug}`;
    set(this, 'listingSlug', listingSlug);

    return this.store.find('django-page', listingSlug.replace(/\/*$/, '/')).then(page => {
      return waitFor({
        page,
        channel: page.get('wnycChannel'),
      });
    });
  },
  afterModel({ channel }) {
    const channelTitle = get(channel, 'title');
    const metrics = get(this, 'metrics');

    metrics.trackEvent({
      category: `Viewed ${get(channel, 'listingObjectType').capitalize()}`,
      action: channelTitle,
      model: channel
    });
  },
  setupController(controller) {
    this._super(...arguments);
    let { navSlug } = this.paramsFor(`${this.routeName}.well`);
    controller.set('channelType', this.routeName);
    controller.set('listingSlug',  get(this, 'listingSlug'));
    controller.set('defaultSlug', navSlug);
  }
});
