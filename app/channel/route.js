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

export default Route.extend({
  session: service(),
  metrics: service(),

  model(params) {
    const channelType = this.routeName;
    const listingSlug = `${inflector.pluralize(channelType)}/${params.slug}`;
    set(this, 'listingSlug', listingSlug);

    return this.store.find('django-page', listingSlug.replace(/\/*$/, '/')).then(page => {
      return waitFor({
        page,
        channel: page.get('wnycChannel'),
        user: this.get('session.data.user')
      });
    });
  },
  afterModel({ channel }) {
    const channelTitle = get(channel, 'title');
    const metrics = get(this, 'metrics');
    
    if (channel.get('donateURL')) {
      this.send('updateDonateLink', channel.get('donateURL'));
    }

    metrics.trackEvent({
      category: `Viewed ${get(channel, 'listingObjectType').capitalize()}`,
      action: channelTitle,
      model: channel
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
