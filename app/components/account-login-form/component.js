import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Changeset from 'ember-changeset';
import LoginValidations from 'overhaul/validations/login';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';

export default Component.extend({
  session: service(),
  isProcessing: false,
  submitTried: false,
  changeset: null,
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
    login() {
      set(this, 'submitTried', true);
      let changeset = get(this, 'changeset');
      let fields = get(this, 'fields');
      let snapshot = changeset.snapshot();
      return changeset
      .cast(Object.keys(fields))
      .validate()
      .then(() => {
        set(this, 'isProcessing', true);
        if (get(changeset, 'isValid')) {
          changeset.execute();
          console.log('ATTEMPTING AUTHENTICATION', fields, changeset.get('errors'), changeset);
          return get(this, 'session').authenticate('authenticator:nypr', fields.email, fields.password)
          .then()
          .catch(e => {
            // server error
            changeset.restore(snapshot);
            set(this, 'isProcessing', false);
            applyErrorToChangeset(e.error, changeset);
            console.log('SERVER ERROR', e.error);
          });
        } else {
          // changeset error
          changeset.restore(snapshot);
          set(this, 'isProcessing', false);
          console.log('CLIENT PROBLEM', changeset.get('error'), changeset.get('errors'));
          return false;
        }
      });
    },
  }
});

let applyErrorToChangeset = function(error, changeset) {
  if (error.code === "UserNotFoundException") {
    changeset.pushErrors('email', 'we couldn\'t find an account with that address. <a href="/accounts/signup">Sign Up</a>');
  } else if (error.code === "NotAuthorizedException") {
    changeset.pushErrors('password', 'this password is incorrect.');
  }
};
