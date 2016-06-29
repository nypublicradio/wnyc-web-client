import moment from 'moment';
import { helper } from 'ember-helper';

// Returns a time like '5 am' if time has no minute part.
// Otherwise returns a time like '5:30 am'.

export default helper(function([ date ]) {
  if (moment(date).minutes() === 0) {
    return moment(date).format('h a');
  }
  return moment(date).format('h:mm a');
});
