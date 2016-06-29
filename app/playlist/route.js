import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let slug = params.id;
    let store = this.store;
    return Ember.RSVP.hash({
      page: store.findRecord('django-page', `streams/${slug}/`),
      streaminfo: store.findRecord('stream', slug)
    });
  }
});
