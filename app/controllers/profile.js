import $ from 'jquery';
import Evented from '@ember/object/evented';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'wqxr-web-client/config/environment';
import { task, waitForEvent } from 'ember-concurrency';
import { get, set } from '@ember/object';
import fetch from 'fetch';
import RSVP from 'rsvp';

const FLASH_MESSAGES = {
  email: 'Your email has been updated. Remember to use this new email the next time you log on.',
  password: 'Your password has been updated.'
};

export default Controller.extend(Evented, {
  session: service(),
  flashMessages: service(),
  torii: service(),
  currentUser: service(),
  emailIsPendingVerification: false,
  siteName: config.siteName,
  siteDomain: config.siteSlug,

  authenticate(password) {
    let email = this.get('model.email');
    return this.get('session').verify(email, password);
  },

  changePassword(changeset) {
    let old_password = changeset.get('currentPassword');
    let new_password = changeset.get('newPassword');
    return new RSVP.Promise((resolve, reject) => {
      let headers = {'Content-Type': 'application/json'};
      headers = this.get('session').authorize(headers);
      fetch(`${config.authAPI}/v1/password`, {
        headers,
        method: 'POST',
        body: JSON.stringify({old_password, new_password})
      })
      .then(response => {
        if (response.ok) {
          resolve();
          this.showFlash('password');
        } else {
          reject();
        }
      });
    });
  },

  requestTempPassword(email) {
    return new RSVP.Promise((resolve, reject) => {
      let headers = {'Content-Type': 'application/json'};
      headers = this.get('session').authorize(headers);
      fetch(`${config.authAPI}/v1/password/send-temp`, {
        headers,
        method: 'POST',
        body: JSON.stringify({email})
      })
      .then(response => {
        if (response.ok) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  },

  showFlash(type) {
    this.get('flashMessages').add({
      message: FLASH_MESSAGES[type],
      type: 'success'
    });
  },

  setEmailPendingStatus: task(function * (email) {
    let url = `${config.membershipAPI}/v1/emails/is-verified/?email=${email}`;
    let headers = {'Content-Type': 'application/json'};
    headers = this.get('session').authorize(headers);
    try {
      let response = yield fetch(url, {headers, method: 'GET'});
      if (response && response.ok) {
        let json = yield response.json();
        // if it's not verified, it's pending
        this.set('emailIsPendingVerification', !get(json, 'data.is_verified'));
      } else {
        this.set('emailIsPendingVerification', false);
      }
    } catch(e) {
      // if there's a problem with the request, return false for pending
      // because we don't want to show the pending message and confuse users.
      this.set('emailIsPendingVerification', false);
    }
  }),

  emailUpdated() {
    this.showFlash('email');
    this.set('emailIsPendingVerification', true);
  },

  resendVerificationEmail() {
    return get(this, 'resendVerificationTask').perform();
  },

  resendVerificationTask: task(function * () {
    let provider = get(this, 'session.data.authenticated.provider');
    if (provider) {
      yield get(this, 'promptForPassword').perform();
    }
    let url = `${config.authAPI}/v1/confirm/resend-attr`;
    let headers = {'Content-Type': 'application/json'};
    headers = this.get('session').authorize(headers);
    return new RSVP.Promise((resolve,reject) => {
      fetch(url, {headers, method: 'GET'}).then(response => {
        if (response && response.ok) {
          resolve();
        } else {
          reject();
        }
      })
      .catch( () => {
        reject();
      });
    });
  }),

  promptForPassword: task(function * () {
    $('body').addClass('has-nypr-account-modal-open');
    try {
      yield waitForEvent(this, 'passwordVerified');
    } finally {
      $('body').removeClass('has-nypr-account-modal-open');
      set(this, 'password', null);
    }
  }).drop(),

  verifyPassword: task(function * () {
    let password = get(this, 'password');
    if (!password) {
      set(this, 'passwordError', ["Password can't be blank."]);
    } else {
      try {
        // attempt to authenticate with cognito
        yield get(this, 'session').authenticate('authenticator:nypr', get(this, 'model.email'), password);
        this.trigger('passwordVerified');
      } catch(e) {
        if (e && get(e, 'error.message')) {
          set(this, 'passwordError', [get(e, 'error.message')]);
        } else {
          set(this, 'passwordError', ["This password is incorrect."]);
        }
      }
    }
  }),

  actions: {
    disableAccount() {
      this.get('model').destroyRecord().then(() => {
        this.setProperties({
          disableModal: false,
          confirmDisableModal: true
        });
      });
    },

    confirmDisable() {
      this.get('session').invalidate().then(() => {
        this.transitionToRoute('index');
      });
    },

    updateEmailStatus(email) {
      this.get('setEmailPendingStatus').perform(email);
    },

    endTask(taskName) {
      get(this, taskName).cancelAll();
    },

    linkFacebookAccount() {
      this.get('torii').open('facebook-connect').then((data) => {
        let facebookId = data.userId;
        let user = this.get('currentUser.user');
        user.set('facebookId', facebookId);
        user.save().then(() => {
          this.showFlash('connected');
        })
        .catch(() => {
          user.rollbackAttributes();
          this.showFlash('connectError', 'warning');
        });
      })
      .catch(() => {
        this.showFlash('connectError', 'warning');
      });
    }
  }
});
