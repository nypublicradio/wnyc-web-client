import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    controller.set('orders', this.store.findAll('order'));
    controller.send('updateEmailStatus', get(model, 'email'));
    return this._super(controller, model);
  },
});
