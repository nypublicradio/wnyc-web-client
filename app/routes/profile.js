import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { get } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  titleToken: 'Profile',
  
  currentUser: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    controller.set('orders', this.store.findAll('order'));
    controller.send('updateEmailStatus', get(model, 'email'));
    return this._super(controller, model);
  },
  actions: {
    didTransition() {
      //shows the zendesk widget if prev loaded
      if (window.zE && typeof window.zE.show === "function") {
        window.zE.show();
      }
    },
    willTransition() {
      //hide the zendesk Widget
      if (window.zE && typeof window.zE.hide === "function") {
        window.zE.hide();
      }
    }
  }
});
