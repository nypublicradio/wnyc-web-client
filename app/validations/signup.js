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
    validatePresence(true),
    validateFormat({ type: 'email', allowBlank: true })
    ],
  password: [
    validatePresence(true),
    validateLength({ min: 8, allowBlank: true })
    ]
};
