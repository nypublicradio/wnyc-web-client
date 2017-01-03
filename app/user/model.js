import DS from 'ember-data';
import computed from 'ember-computed';
import fetch from 'fetch';
import config from 'overhaul/config/environment';
const {
  Model,
  attr
} = DS;

export default Model.extend({
  email:              attr('string'),
  givenName:          attr('string'),
  familyName:         attr('string'),
  preferredUsername:  attr('string'),
  isStaff:            computed(function() {
    fetch(`${config.wnycAccountRoot}/api/v1/is_logged_in/`, {
      credentials: 'include'
    })
    .then(r => r.json())
    .then(({is_staff}) => {
      if (is_staff) {
        this.set('isStaff', true);
      }
    });
  })
});
