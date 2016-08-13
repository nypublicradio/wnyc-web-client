import Ember from 'ember';
import moment from 'moment';

export function humanizeDuration(params/*, hash*/) {
  let h = moment.duration(params[0], 'seconds').get('hours');
  let m = moment.duration(params[0], 'seconds').get('minutes');
  let s = moment.duration(params[0], 'seconds').get('seconds');

  if (h > 0) {
    return `${withUnits(h, 'hour')} ${withUnits(m, 'minute')}`.trim();
  }
  else if (m > 0) {
    if (s > 29) {
      m = m + 1; // round up the minutes
    }
    return `${withUnits(m, 'minute')}`.trim();
  }
  else {
    return `${withUnits(s, 'second')}`.trim();
  }
}

function withUnits(value, singularUnit) {
  var unit = `${value === 1 ? singularUnit : `${singularUnit}s`}`;
  if (value > 0) {
    return `${value} ${unit}`;
  }
  else {
    return "";
  }
}

export default Ember.Helper.helper(humanizeDuration);
