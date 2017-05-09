import Route from 'ember-route';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import get from 'ember-metal/get';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),
  session: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    if (this.features.isEnabled('member-center')) {
      controller.set('orders', this.store.findAll('order'));
      controller.send('updateEmailStatus', get(model, 'user.email'));
    }
    return this._super(controller, model);
  },
});
