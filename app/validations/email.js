import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';

const requiredMessage = '{description} is required';
const emailFormatMessage = 'this is not a valid email address';

export default {
  email: [
    validatePresence({ presence: true, message: requiredMessage }),
    validateFormat({ type: 'email', allowBlank: true, message: emailFormatMessage })
    ]
};
