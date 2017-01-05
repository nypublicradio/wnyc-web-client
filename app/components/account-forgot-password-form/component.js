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
    }
  },
  requestPasswordResetEmail(email) {
    let url = `${ENV.wnycAuthAPI}/v1/password/forgot?email=${email}`;
    let method = 'GET';
    let mode = 'cors';
    return fetch(url, {method, mode})
    .then(rejectUnsuccessfulResponses);
  },
});
