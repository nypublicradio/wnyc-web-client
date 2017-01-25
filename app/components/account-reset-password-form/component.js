import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import PasswordValidations from 'wnyc-web-client/validations/password';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';
import ENV from 'wnyc-web-client/config/environment';
import RSVP from 'rsvp';
import fetch from 'fetch';
import { rejectUnsuccessfulResponses } from 'wnyc-web-client/utils/fetch-utils';

const FLASH_MESSAGES = {
  reset: 'Your password has been successfully updated.'
};

export default Component.extend({
  store: service(),
  routing: service('wnyc-routing'),
  resendEndpoint: `${ENV.wnycAuthAPI}/v1/password/forgot`,
  allowedKeys: ['password'],
  codeExpired: false,
  passwordWasReset: false,
  init() {
    this._super(...arguments);
    if ( !(get(this, 'email') && get(this, 'confirmation')) ) {
      // if we got here with missing url parameters,
      // (i.e. typing url, bad copy/paste)
      // send the user to the 'forgot' page so they can request a reset email
      return get(this, 'routing').transitionTo('forgot');
    }
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
      if (get(e, 'errors.code') === 'ExpiredCodeException') {
        set (this, 'codeExpired', true);
      } else {
        get(this, 'changeset').validate('password');
        get(this, 'changeset').pushErrors('password', 'There was a problem changing your password.');
      }
      return RSVP.Promise.reject(e);
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
      this.set('passwordWasReset', true);
      return this.showFlash('reset');
    }
  },
});
