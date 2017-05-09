import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import { task } from 'ember-concurrency';
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

  updateEmailStatus: task(function * (authorization, email) {
    let url = `${config.wnycMembershipAPI}/v1/emails/is-verified/?email=${email}`;
    try {
      let response = yield fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization
        }
      });
      if (response && response.ok) {
        let json = yield response.json();
        // if it's not verified, it's pending
        let pendingVerification = !json.data.is_verified;
        this.set('emailIsPendingVerification', pendingVerification);
      }
    } catch(e) {
      // if there's a problem with the request, don't change the status
      // because we don't want to show the pending message and confuse users.
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

    checkEmailStatus(email) {
      this.get('session').authorize('authorizer:nypr', (_, authorization) => {
        this.get('updateEmailStatus').perform(authorization, email);
      });
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
