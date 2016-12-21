import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';

export default Controller.extend({
  session: service(),
  
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
          Authorization: value
        },
        body: JSON.stringify({old_password, new_password})
      });
    });
  },
  
  actions: {
    edit() {
      this.set('isEditing', true);
    }
  }
});
