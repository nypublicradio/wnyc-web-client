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
  changeset: null,
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      email: '',
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(LoginValidations), LoginValidations));
  },
  actions: {
    login() {
      let changeset = get(this, 'changeset');
      let fields = get(this, 'fields');
      let snapshot = changeset.snapshot();
      return changeset
      .cast(Object.keys(fields))
      .validate()
      .then(() => {
        set(this, 'isProcessing', true);
        if (get(changeset, 'isValid')) {
          console.log('ATTEMPTING AUTHENTICATION', fields, changeset.get('errors'), changeset);
          changeset.execute();
          return get(this, 'session').authenticate('authenticator:nypr', fields.email, fields.password);
        }
        changeset.restore(snapshot);
        set(this, 'isProcessing', false);
        console.log('VALIDATION FAILED', fields, changeset.get('errors'), changeset);
        return false;
      }).catch((e) => {
        set(this, 'isProcessing', false);
        console.log('LOGIN FAILED', fields);
        console.log('what went wrong:', e);
      });
    },
  }
});
