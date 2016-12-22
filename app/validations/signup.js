import {
  validatePresence,
  validateFormat,
  validateConfirmation,
} from 'ember-changeset-validations/validators';
import messages from './custom-messages';

export default {
  givenName: [
    validatePresence({ presence: true, message: messages.firstNameRequired })
    ],
  familyName: [
    validatePresence({ presence: true, message: messages.lastNameRequired })
    ],
  email: [
    validateFormat({ type: 'email', allowBlank: true, message: messages.emailFormat }),
    validatePresence({ presence: true, message: messages.emailRequired })
    ],
  emailConfirmation: [
    validateConfirmation({ on: 'email', allowBlank: true, message: messages.emailConfirmation}),
  ],
  typedPassword: [
    validateFormat({regex: /^(?=.*?[0-9]).{8,}$/, allowBlank: true, message: messages.passwordRules }),
    validatePresence({ presence: true, message: messages.passwordRequired })
    ]
};
