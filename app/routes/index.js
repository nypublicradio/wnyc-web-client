import Ember from 'ember';
import service from 'ember-service/inject';
import rsvp from 'rsvp';
const { hash } = rsvp;
const { get } = Ember;

export default Ember.Route.extend({
  classNames: ['home'],
  metrics: service(),
  
  model() {
    // hacky way just to get all those stinking stream models in so /settings
    // doesn't only pick up the wnyc stream before the promise resolves
    // (and screws up the option list)
    this.store.findAll('stream');
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
    return hash({page, featuredStream});
  },
  afterModel({ page }) {
    let metrics = get(this, 'metrics');
    let path = document.location.pathname; // e.g. '/shows/bl/'
    let title = (get(page, 'title') || '').trim();
    metrics.invoke('trackPage', 'NprAnalytics', {
      isNpr: true,
      page: path,
      title
    });
  }
});
