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
    validateLength({ max: 20, message: messages.firstNameMaxLength }),
    validateFormat({ regex: /^\S.*$/, allowBlank: true, message: messages.noLeadingSpace }),
    validateFormat({ regex: /^.*\S$/, allowBlank: true, message: messages.noTrailingSpace })
    ],
  familyName: [
    validatePresence({ presence: true, message: messages.lastNameRequired }),
    validateLength({ max: 40, message: messages.lastNameMaxLength }),
    validateFormat({ regex: /^\S.*$/, allowBlank: true, message: messages.noLeadingSpace }),
    validateFormat({ regex: /^.*\S$/, allowBlank: true, message: messages.noTrailingSpace })
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
