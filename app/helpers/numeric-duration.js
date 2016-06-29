import moment from 'moment';
import { helper } from 'ember-helper';

export default helper(function([time]) {
  let hours = moment.duration(time).get('hours');
  let minutes = moment.duration(time).get('minutes');
  let seconds = moment.duration(time).get('seconds');
  seconds = String(seconds).length === 1 ? `0${seconds}` : seconds;

  return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds}`;
});
