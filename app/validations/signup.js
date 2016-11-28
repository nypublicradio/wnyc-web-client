import {
  validatePresence,
  validateFormat,
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  firstName: [
    validatePresence(true)
    ],
  lastName: [
    validatePresence(true)
    ],
  email: [
    validateFormat({ type: 'email', allowBlank: true }),
    validatePresence(true)
    ],
  password: [
    validateLength({ min: 8, allowBlank: true }),
    validatePresence(true)
    ]
};
