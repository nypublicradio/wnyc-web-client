import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Changeset from 'ember-changeset';
import LoginValidations from 'wnyc-web-client/validations/login';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';

export default Component.extend({
  session: service(),
  routing: service('wnyc-routing'),
  allowedKeys: ['email', 'password'],
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      email: '',
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(LoginValidations), LoginValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      this.authenticate(get(this, 'fields.email'), get(this, 'fields.password'));
    },
    onSuccess() {
      this.goHome();
    },
    onFailure(e) {
      if (e.errors) {
        this.applyErrorToChangeset(e.errors, get(this, 'changeset'));
      }
    },
  },
  authenticate(email, password) {
    return get(this, 'session').authenticate('authenticator:nypr', email, password);
  },
  goHome() {
    get(this, 'routing').transitionTo('index');
  },
  applyErrorToChangeset(error, changeset) {
    if (error && error.code) {
      if (error.code === "NotAuthorizedException") {
        changeset.validate('password');
        changeset.pushErrors('password', 'Incorrect username or password.');
      } else if (error.code === "UserNotFoundException") {
        changeset.validate('email');
        changeset.pushErrors('email', 'email address not found');
      }
    }
  }
});
