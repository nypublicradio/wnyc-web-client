import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import EmailValidations from 'overhaul/validations/email';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';
import ENV from 'overhaul/config/environment';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'overhaul/utils/fetch-utils';

export default Component.extend({
  store: service(),
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
    let url = `${ENV.wnycAuthAPI}/password/forgot?email=${email}`;
    let method = 'GET';
    let mode = 'cors';
    return fetch(url, {method, mode})
    .then(rejectUnsuccessfulResponses);
  },
});
