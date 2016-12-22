import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';
import messages from './custom-messages';

export default {
  password: [
    validateLength({ min: 8, allowBlank: true, message: messages.passwordRules }),
    validatePresence({ presence: true, message: messages.passwordRequired })
    ]
};
