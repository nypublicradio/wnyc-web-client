import Ember from 'ember';
import rsvp from 'rsvp';
const { hash } = rsvp;

export default Ember.Route.extend({
  classNames: ['home'],
  model() {
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
    return hash({page, featuredStream});
  }
});
