import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import EmailValidations from 'wnyc-web-client/validations/email';
import lookupValidator from 'ember-changeset-validations';
import ENV from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'wnyc-web-client/utils/fetch-utils';

export default Component.extend({
  allowedKeys: ['email'],
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      email: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(EmailValidations), EmailValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      return this.requestPasswordResetEmail(get(this, 'fields.email'));
    },
    onFailure(e) {
      if (e) {
        this.applyErrorToChangeset(e.error, get(this, 'changeset'));
      }
    },
  },
  requestPasswordResetEmail(email) {
    let url = `${ENV.wnycAuthAPI}/v1/password/forgot?email=${email}`;
    let method = 'GET';
    let mode = 'cors';
    return fetch(url, {method, mode})
    .then(rejectUnsuccessfulResponses);
  },
  applyErrorToChangeset(error, changeset) {
    if (error) {
      if (error.code === "UserNotFoundException") {
        changeset.validate('email');
        changeset.pushErrors('email', `We cannot find an account for the email ${changeset.get('email')}. <a href="/signup">Sign up?</a>`);
      }
    }
  },
});
