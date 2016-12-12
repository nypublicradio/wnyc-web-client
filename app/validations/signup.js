import {
  validatePresence,
  validateFormat,
  validateLength,
} from 'ember-changeset-validations/validators';

const requiredMessage = '{description} is required';
const emailFormatMessage = 'this is not a valid email address';
const passwordRulesMessage = 'password must be at least 8 character';

export default {
  firstName: [
    validatePresence({ presence: true, message: requiredMessage })
    ],
  lastName: [
    validatePresence({ presence: true, message: requiredMessage })
    ],
  email: [
    validateFormat({ type: 'email', allowBlank: true, message: emailFormatMessage }),
    validatePresence({ presence: true, message: requiredMessage })
    ],
  typedPassword: [
    validateLength({ min: 8, allowBlank: true, message: passwordRulesMessage }),
    validatePresence({ presence: true, message: requiredMessage })
    ]
};
