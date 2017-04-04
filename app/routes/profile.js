import Route from 'ember-route';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),
  model() {
    return this.get('currentUser.user').then(result => {
      return {
        user: result,
        order: this.store.findAll('order')
      };
    });
  }
});
