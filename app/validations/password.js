import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';
import messages from './custom-messages';

export default {
  password: [
    validateFormat({regex: /^(?=[\S]*?[0-9]).{8,}$/, allowBlank: true, message: messages.passwordRules }),
    validatePresence({ presence: true, message: messages.passwordRequired })
    ]
};
