import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Changeset from 'ember-changeset';
import LoginValidations from 'overhaul/validations/login';
import lookupValidator from 'ember-changeset-validations';
import service from 'ember-service/inject';

export default Component.extend({
  session: service(),
  routing: service('wnyc-routing'),
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
          .then(() => {
            // after login, redirect to home page
            get(this, 'routing').transitionTo('index');
          })
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
  if (error && error.code) {
    // auth service shouldn't return "UserNotFoundException".
    if (error.code === "UserNotFoundException" || "NotAuthorizedException") {
      changeset.validate('password');
      changeset.pushErrors('password', 'Incorrect username or password.');
    }
  }
};
