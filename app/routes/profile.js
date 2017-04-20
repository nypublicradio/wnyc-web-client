import Route from 'ember-route';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),
  model() {
    return RSVP.hash({
      user: this.get('currentUser.user'),
    });
  },
  setupController(controller, model) {
    if (this.features.isEnabled('member-center')) {
      controller.set('orders', this.store.findAll('order'));
    }
    return this._super(controller, model);
  }
});
