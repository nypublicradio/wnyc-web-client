import Component from 'ember-component';
import set from 'ember-metal/set';
import Changeset from 'ember-changeset';
import LoginValidations from 'overhaul/validations/login';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  isProcessing: false,
  changeset: null,
  init() {
    this._super(...arguments);
    let fields = {
      email: '',
      password: ''
    };
    set(this, 'changeset', new Changeset(fields, lookupValidator(LoginValidations), LoginValidations));
  },
  actions: {
    login() {

    },
  }
});
