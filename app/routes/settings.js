import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  titleToken: 'Settings',
  
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
