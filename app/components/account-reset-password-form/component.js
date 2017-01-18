import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import PasswordValidations from 'wnyc-web-client/validations/password';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';
import ENV from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'wnyc-web-client/utils/fetch-utils';

const FLASH_MESSAGES = {
  reset: 'Your password has been successfully updated.'
};

export default Component.extend({
  store: service(),
  resendEndpoint: `${ENV.wnycAuthAPI}/v1/password/forgot`,
  allowedKeys: ['password'],
  codeExpired: false,
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(PasswordValidations), PasswordValidations));
    get(this, 'changeset').validate();
  },
  resetPassword(email, new_password, confirmation) {
    let url = `${ENV.wnycAuthAPI}/v1/confirm/password-reset`;
    let method = 'POST';
    let mode = 'cors';
    let headers = { "Content-Type" : "application/json" };
    let body = JSON.stringify({email, new_password, confirmation});
    return fetch(url, {method, mode, headers, body})
    .then(rejectUnsuccessfulResponses)
    .catch(e => {
      if (get(e, 'error.code') === 'ExpiredCodeException') {
        set (this, 'codeExpired', true);
      }
    });
  },
  showFlash(type) {
    this.get('flashMessages').add({
      message: FLASH_MESSAGES[type],
      type: 'success',
      sticky: true
    });
  },
  actions: {
    onSubmit() {
      return this.resetPassword(get(this, 'email'), get(this, 'fields.password'), get(this, 'confirmation'));
    },
    onSuccess() {
      return this.showFlash('reset');
    }
  },
});
