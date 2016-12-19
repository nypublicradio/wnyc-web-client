import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import SignupValidations from 'overhaul/validations/signup';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';

export default Component.extend({
  store: service(),
  isProcessing: false,
  submitTried: false,
  changeset: null,
  init() {
    this._super(...arguments);
    set(this, 'newUser', this.get('store').createRecord('user'));
    set(this, 'changeset', new Changeset(get(this, 'newUser'), lookupValidator(SignupValidations), SignupValidations));
    get(this, 'changeset').validate();
  },
  actions: {
    signUp() {
      set(this, 'submitTried', true);
      let changeset = get(this, 'changeset');
      let snapshot = changeset.snapshot();
      return changeset
      .cast(['email','givenName','familyName','typedPassword'])
      .validate()
      .then(() => {
        if (get(changeset, 'isValid')) {
          set(this, 'isProcessing', true);
          changeset.save()
          .then(() => {
            set(this, 'emailSent', true);
          })
          .catch(e => {
            // server error
            set(this, 'isProcessing', false);
            set(this, 'loginFailed', true);
            changeset.restore(snapshot);
            applyErrorToChangeset(e.errors, changeset);
            console.log('SERVER PROBLEM', e.errors);
          });
        } else {
          // changeset error
          set(this, 'isProcessing', false);
          set(this, 'loginFailed', true);
          changeset.restore(snapshot);
          console.log('CLIENT PROBLEM', changeset.get('error'), changeset.get('errors'));
        }
      });
    }
  }
});

let applyErrorToChangeset = function(error, changeset) {
  if (error.code === "UsernameExistsException") {
    changeset.pushErrors('email', 'an account already exists for that email. <a href="/accounts/login">Log in</a>');
  }
};
