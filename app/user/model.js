import DS from 'ember-data';
import { equal, not } from 'ember-computed';
const {
  Model,
  attr
} = DS;

export default Model.extend({
  email:              attr('string'),
  givenName:          attr('string'),
  familyName:         attr('string'),
  preferredUsername:  attr('string'),
  picture:            attr('string'),
  facebookId:         attr('string'),
  status:             attr('string'),

  socialOnly:         equal('status', 'FORCE_CHANGE_PASSWORD'),
  hasPassword:        not('socialOnly')
});
