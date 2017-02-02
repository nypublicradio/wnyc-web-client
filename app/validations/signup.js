import {
  validatePresence,
  validateFormat,
  validateConfirmation,
  validateLength
} from 'ember-changeset-validations/validators';
import messages from './custom-messages';

export default {
  givenName: [
    validatePresence({ presence: true, message: messages.firstNameRequired }),
    validateLength({ max: 20, message: messages.firstNameMaxLength })
    ],
  familyName: [
    validatePresence({ presence: true, message: messages.lastNameRequired }),
    validateLength({ max: 40, message: messages.lastNameMaxLength })
    ],
  email: [
    validateFormat({ type: 'email', allowBlank: true, message: messages.emailFormat }),
    validatePresence({ presence: true, message: messages.emailRequired })
    ],
  emailConfirmation: [
    validateConfirmation({ on: 'email', allowBlank: true, message: messages.emailConfirmation}),
  ],
  typedPassword: [
    validateFormat({regex: /^(?=[\S]*?[0-9]).{8,}$/, allowBlank: true, message: messages.passwordRules }),
    validatePresence({ presence: true, message: messages.passwordRequired })
    ]
};
