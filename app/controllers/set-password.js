import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wqxr-web-client/config/environment';
import get from 'ember-metal/get';

const FLASH_MESSAGES = {
  set: 'Your password has been successfully updated.',
  edit: 'You can now edit your information.'
};

export default Controller.extend({
  session: service(),
  config: config,
  queryParams: ['username', 'code', 'email'],
  username: null,
  code: null,
  email: null,
  showFlash(type) {
    this.get('flashMessages').add({
      message: FLASH_MESSAGES[type],
      type: 'success',
      sticky: true
    });
  },
  actions: {
    afterSetPassword() {
      if (get(this, 'session.isAuthenticated')) {
        this.showFlash('edit');
        return this.transitionToRoute('profile');
      } else {
        return this.showFlash('set');
      }
    }
  }
});
