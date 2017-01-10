import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import fetch from 'fetch';

const FLASH_MESSAGES = {
  email: 'Your email has been updated. Remember to use this new email the next time you log on.'
};

export default Controller.extend({
  session: service(),
  flashMessages: service(),
  
  authenticate(password) {
    let email = this.get('model.email');
    return this.get('session').authenticate('authenticator:nypr', email, password);
  },
  
  changePassword(changeset) {
    let old_password = changeset.get('currentPassword');
    let new_password = changeset.get('newPassword');
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      fetch(`${config.wnycAuthAPI}/v1/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: value
        },
        body: JSON.stringify({old_password, new_password})
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
