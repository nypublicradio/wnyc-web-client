import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';

export default Controller.extend({
  config,
  session: service(),
  flashMessages: service(),
  queryParams: ['email_id', 'verification_token'],
  email_id: null,
  verification_token: null,
  actions: {
    goToProfile(errorMessage) {
      let flashMessages = this.get('flashMessages');
      if (!errorMessage) {
        flashMessages.add({
          message: 'Your email address has been successfully verified',
          type: 'success',
          sticky: true
        });
      } else {
        flashMessages.add({
          message: errorMessage,
          type: 'warning',
          sticky: true
        });
      }
      this.transitionToRoute('profile');
    }
  }
});
