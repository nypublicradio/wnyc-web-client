import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import SignupValidations from 'wnyc-web-client/validations/signup';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';
import ENV from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'wnyc-web-client/utils/fetch-utils';

export default Component.extend({
  store: service(),
  allowedKeys: ['email','emailConfirmation','givenName','familyName','typedPassword'],
  init() {
    this._super(...arguments);
    set(this, 'newUser', this.get('store').createRecord('user'));
    set(this, 'changeset', new Changeset(get(this, 'newUser'), lookupValidator(SignupValidations), SignupValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      return this.signUp();
    },
    onFailure(e) {
      if (e) {
        this.applyErrorToChangeset(e.errors, get(this, 'changeset'));
      }
    },
  },
  signUp() {
    return get(this, 'newUser').save();
  },
  applyErrorToChangeset(error, changeset) {
    if (error) {
      if (error.code === "AccountExists") {
        changeset.validate('email');
        changeset.pushErrors('email', `An account already exists for the email ${changeset.get('email')}.<br/> <a href="/login">Log in?</a> <a href="/forgot">Forgot password?</a>`);
        changeset.set('emailConfirmation', null);
        changeset.set('error.emailConfirmation', null);
      }
    }
  },
  resendConfirmationEmail(email) {
    let url = `${ENV.wnycAuthAPI}/v1/confirm/resend?email=${email}`;
    let method = 'GET';
    let mode = 'cors';
    return fetch(url, {method, mode})
    .then(rejectUnsuccessfulResponses);
  }
});
