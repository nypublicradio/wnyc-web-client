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
  changeset: null,
  init() {
    this._super(...arguments);
    set(this, 'fields', {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    set(this, 'changeset', new Changeset(get(this, 'fields'), lookupValidator(SignupValidations), SignupValidations));
  },
  actions: {
    signUp() {
      let changeset = get(this, 'changeset');
      let snapshot = changeset.snapshot();
      let fields = get(this, 'fields');
      let newUser;
      return changeset
      .cast(Object.keys(fields))
      .validate()
      .then(() => {
        if (get(changeset, 'isValid')) {
          changeset.save()
          .then(() => {
            console.log('SIGNING UP WITH', fields);
            set(this, 'isProcessing', true);
            newUser = this.get('store').createRecord('user', {
              email: fields.email,
              firstName: fields.firstName,
              lastName: fields.lastName
            });
            // typedPassword will be available to send to our new user api endpoint but won't be persisted to the store
            newUser.set('typedPassword', fields.password);
            newUser.save().then(function() {

            }).catch(e => {
              set(this, 'isProcessing', false);
              set(this, 'loginFailed', true);
              console.log('LOGIN FAILED', fields, changeset.get('errors'), changeset);
              console.log('what went wrong', e);
              console.log('model errors', newUser.get('errors'));
            });
          });
        }
        set(this, 'isProcessing', false);
        set(this, 'loginFailed', true);
        changeset.restore(snapshot);
        console.log('LOGIN FAILED', fields, changeset.get('errors'), changeset);
      }).catch(() => {
        set(this, 'isProcessing', false);
        set(this, 'loginFailed', true);
        console.log('LOGIN FAILED', fields, changeset.get('errors'), changeset);
        changeset.restore(snapshot);
      });
    }
  }

});
