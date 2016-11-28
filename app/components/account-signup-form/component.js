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
    let fields = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    set(this, 'changeset', new Changeset(fields, lookupValidator(SignupValidations), SignupValidations));
  },
  actions: {
    signUp() {
      let changeset = get(this, 'changeset');
      console.log('submit?', changeset);
      if (get(this, 'changeset.isValid')) {
        set(this, 'emailSent', true);
      }
    },
  }

});
