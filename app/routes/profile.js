import Route from 'ember-route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { get } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    if (this.features.isEnabled('member-center')) {
      controller.set('orders', this.store.findAll('order'));
      controller.send('updateEmailStatus', get(model, 'email'));
    }
    return this._super(controller, model);
  },
});
