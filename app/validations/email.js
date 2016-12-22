import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';
import messages from './custom-messages';

export default {
  email: [
    validatePresence({ presence: true, message:  messages.emailRequired }),
    validateFormat({ type: 'email', allowBlank: true, message: messages.emailFormat })
    ]
};
