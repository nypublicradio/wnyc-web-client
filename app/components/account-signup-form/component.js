import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import SignupValidations from 'overhaul/validations/signup';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
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
      return changeset
      .cast(Object.keys(get(this, 'fields')))
      .validate()
      .then(() => {
        if (get(changeset, 'isValid')) {
          changeset.save()
          .then(() => {
            console.log('SIGNING UP WITH', get(this, 'fields'));
            set(this, 'emailSent', true);
          });
        }
      }).catch(() => {
        console.log('UPDATE FAILED', get(this, 'fields'), changeset.get('errors'), changeset);
        changeset.restore(snapshot);
      });
    },
  }

});
