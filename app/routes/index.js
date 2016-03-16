import Ember from 'ember';
import service from 'ember-service/inject';
import rsvp from 'rsvp';
const { hash } = rsvp;
const { get } = Ember;

export default Ember.Route.extend({
  classNames: ['home'],
  metrics: service(),
  
  model() {
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
    return hash({page, featuredStream});
  },
  afterModel() {
    const metrics = get(this, 'metrics');
    // must run before trackPageview
    metrics.invoke('nprDimensions', 'GoogleAnalytics', {});
    //
  }
});
