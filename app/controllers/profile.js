import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import RSVP from 'rsvp';

const FLASH_MESSAGES = {
  email: 'Your email has been updated. Remember to use this new email the next time you log on.',
  password: 'Your password has been updated.'
};

export default Controller.extend({
  session: service(),
  flashMessages: service(),
  siteName: config.siteName,
  siteDomain: config.siteSlug,
  emailPendingVerification: false,

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
    }
  }
});
