import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import PasswordValidations from 'overhaul/validations/password';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';
import ENV from 'overhaul/config/environment';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'overhaul/utils/fetch-utils';

export default Component.extend({
  store: service(),
  allowedKeys: ['password'],
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(PasswordValidations), PasswordValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      return this.resetPassword(get(this, 'email'), get(this, 'fields.password'), get(this, 'code'));
    }
  },
  resetPassword(email, new_password, confirmation) {
    let url = `${ENV.wnycAuthAPI}/confirm/password-reset`;
    let method = 'POST';
    let mode = 'cors';
    let body = JSON.stringify({email, new_password, confirmation});
    return fetch(url, {method, mode, body})
    .then(rejectUnsuccessfulResponses);
  },
});
