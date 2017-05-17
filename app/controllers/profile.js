import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import { task } from 'ember-concurrency';
import get from 'ember-metal/get';
import fetch from 'fetch';
import RSVP from 'rsvp';

const FLASH_MESSAGES = {
  email: 'Your email has been updated. Remember to use this new email the next time you log on.',
  password: 'Your password has been updated.'
};

export default Controller.extend({
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
      this.get('session').authorize('authorizer:nypr', (header, value) => {
        fetch(`${config.wnycAuthAPI}/v1/password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: value
          },
          body: JSON.stringify({old_password, new_password})
        })
        .then(response => {
          if (response.ok) {
            resolve(response);
            this.showFlash('password');
          } else if (response.json) {
            response.json().then(reject);
          } else {
            reject(response);
          }
        });
      });
    });
  },

  showFlash(type) {
    this.get('flashMessages').add({
      message: FLASH_MESSAGES[type],
      type: 'success',
      sticky: true
    });
  },

  setEmailPendingStatus: task(function * (email) {
    let url = `${config.wnycMembershipAPI}/v1/emails/is-verified/?email=${email}`;
    let headers = {'Content-Type': 'application/json'};
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      headers[header] = value;
    });
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
    let url = `${config.wnycAuthAPI}/v1/confirm/resend-attr/`;
    let headers = {'Content-Type': 'application/json'};
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      headers[header] = value;
    });
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
  },

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
