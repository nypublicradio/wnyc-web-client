import Ember from 'ember';
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
import messages from 'wnyc-web-client/validations/custom-messages';

export default Component.extend({
  store: service(),
  session: service(),
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
    signupWithFacebook() {
      let authenticator = Ember.getOwner(this).lookup('authenticator:torii');
      authenticator.authenticate('facebook-connect').then(({access_token}) => {
        window.FB.api('/me', {fields: 'first_name,last_name,email,picture.width(500)'}, data => {
          // collect user attrs from FB api and send to auth
          let attrs = {
            providerToken: access_token,
            givenName: data.first_name,
            familyName: data.last_name,
            email: data.email,
            picture: data.picture.data.url,
            facebookId: data.id
          };
          let user = this.get('store').createRecord('user', attrs);
          user.save({adapterOptions: {provider: 'facebook-connect'}}).then(() => {
            // TODO: this opens a pop up twice, but how else to get an access token
            // and create a user withouth first triggering the sessionAuthenticated
            // event? if we authenticate first, the sessionAuthenticated event fires
            // which tries to load a user before we've had a chance to send the token
            // to the back end
            this.get('session').authenticate('authenticator:torii', 'facebook-connect');
          });
        });
      })
      .catch(() => {});
    }
  },
  signUp() {
    return get(this, 'newUser').save();
  },
  onEmailInput() {
    if (get(this, 'changeset.emailConfirmation')) {
      get(this, 'changeset').validate('emailConfirmation');
    }
  },
  applyErrorToChangeset(error, changeset) {
    if (error) {
      changeset.rollback(); // so errors don't stack up
      if (error.code === "AccountExists") {
        changeset.validate('email');
        changeset.pushErrors('email', `An account already exists for the email ${changeset.get('email')}.<br/> <a href="/login">Log in?</a> <a href="/forgot">Forgot password?</a>`);
      } else if (error.message === 'User is disabled') {
        changeset.pushErrors('email', messages.userDisabled);
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
