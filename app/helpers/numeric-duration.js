import moment from 'moment';
import { helper } from 'ember-helper';

export function numericDuration([milliseconds]) {
  let hours = moment.duration(milliseconds).get('hours');
  let minutes = moment.duration(milliseconds).get('minutes');
  if (hours > 1) {
    minutes = String(minutes).length === 1 ? `0${minutes}` : minutes;
  }
  let seconds = moment.duration(milliseconds).get('seconds');
  seconds = String(seconds).length === 1 ? `0${seconds}` : seconds;

  return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds}`;
}

export default helper(numericDuration);
