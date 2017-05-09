import Route from 'ember-route';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'wqxr-web-client/config/environment';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),
  session: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    if (this.features.isEnabled('member-center')) {
      controller.set('orders', this.store.findAll('order'));
      this.get('checkVerificationStatus').perform(controller, model);
    }
    return this._super(controller, model);
  },

  checkVerificationStatus: task(function * (controller, model) {
    yield this.get('session').authorize('authorizer:nypr', (_, authorization) => this.get('setVerificationStatus').perform(authorization, controller, model));
  }).on('init'),

  setVerificationStatus: task(function * (authorization, controller, model) {
    let email = get(model, 'user.email');
    let url = `${config.wnycMembershipAPI}/v1/emails/is-verified/?email=${email}`;
    try {
      let response = yield fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization
        }
      });
      if (response && response.ok) {
        let json = yield response.json();
        // if it's not verified, it's pending
        let pendingVerification = !json.data.is_verified;
        controller.set('emailPendingVerification', pendingVerification);
      }
    } catch(e) {
      // if there's a problem with the request, don't change the status
      // because we don't want to show the pending message and confuse users.
    }
  }),
});
