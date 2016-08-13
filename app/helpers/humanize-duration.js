import Ember from 'ember';
import moment from 'moment';

export function humanizeDuration(params/*, hash*/) {
  var humanized;
  if (params[0] < 60) {
    return `${params[0]} seconds`;
  }
  else {
     humanized = moment.duration(params[0], params[1]).humanize();
  }

  if (humanized === 'an hour') {
    return '1 hour';
  }
  else {
    return humanized;
  }
}

export default Ember.Helper.helper(humanizeDuration);
