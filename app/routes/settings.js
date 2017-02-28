import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findAll('stream', { reload: true }).then(streams => {
      return streams.filterBy('audioBumper');
    });
  },

  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
