import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import SignupValidations from 'overhaul/validations/signup';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';

export default Component.extend({
  store: service(),
  allowedKeys: ['email','givenName','familyName','typedPassword'],
  init() {
    this._super(...arguments);
    set(this, 'newUser', this.get('store').createRecord('user'));
    set(this, 'changeset', new Changeset(get(this, 'newUser'), lookupValidator(SignupValidations), SignupValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    onSubmit() {
      return this.signUp();
    },
    onFailure(e) {
      if (e.errors) {
        this.applyErrorToChangeset(e.errors, get(this, 'changeset'));
      }
    }
  },
  signUp() {
    return get(this, 'changeset').save();
  },
  applyErrorToChangeset(error, changeset) {
    if (error) {
      if (error.code === "UsernameExistsException") {
        changeset.pushErrors('email', 'an account already exists for that email. <a href="/accounts/login">Log in</a>');
      }
    }
  }
});
