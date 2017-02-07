import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Changeset from 'ember-changeset';
import LoginValidations from 'wnyc-web-client/validations/login';
import lookupValidator from 'ember-changeset-validations';
import ENV from 'wnyc-web-client/config/environment';
import service from 'ember-service/inject';
import messages from 'wnyc-web-client/validations/custom-messages';

export default Component.extend({
  session: service(),
  messages,
  resendEndpoint: `${ENV.wnycAuthAPI}/v1/confirm/resend`,
  allowedKeys: ['email', 'password'],
  triedUnverifiedAccount: false,
  showLoginError: false,
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      email: '',
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(LoginValidations), LoginValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      set(this, 'showLoginError', false);
      return this.authenticate(get(this, 'fields.email'), get(this, 'fields.password'));
    },
    onFailure(e) {
      if (e) {
        if (get(e, 'errors.code') === 'AccountNotConfirmed') {
          set(this, 'triedUnconfirmedAccount', true);
        } else if (get(e, 'errors.code') === 'UnauthorizedAccess') {
          set(this, 'showLoginError', true);
        } else {
          this.applyErrorToChangeset(e.errors, get(this, 'changeset'));
        }
      }
    },
  },
  authenticate(email, password) {
    return get(this, 'session').authenticate('authenticator:nypr', email, password);
  },
  applyErrorToChangeset(error, changeset) {
    if (error && error.code) {
      changeset.rollback(); // so errors don't stack up
      if (error.message === 'User is disabled') {
        changeset.pushErrors('email', messages.userDisabled);
      } else if (error.code === "UserNotFoundException") {
        changeset.validate('email');
        changeset.pushErrors('password', messages.emailNotFound( changeset.get('email') ));
      }
    }
  }
});
