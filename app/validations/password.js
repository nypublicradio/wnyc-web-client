import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

const requiredMessage = '{description} is required';
const passwordRulesMessage = 'password must be at least 8 character';

export default {
  password: [
    validateLength({ min: 8, allowBlank: true, message: passwordRulesMessage }),
    validatePresence({ presence: true, message: requiredMessage })
    ]
};
