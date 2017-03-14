import Controller from 'ember-controller';
import service from 'ember-service/inject';

export default Controller.extend({
  flashMessages: service(),
  queryParams: ['email_pk', 'verification_code'],
  email_pk: null,
  verification_code: null,
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
          type: 'danger',
          sticky: true
        });
      }
      this.transitionToRoute('profile');
    }
  }
});
