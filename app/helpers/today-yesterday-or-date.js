import moment from 'moment';
import { helper } from 'ember-helper';

export function todayYesterdayOrDate([date]/*, hash*/) {
  return moment(date).calendar(null, {
    sameDay:  '[Today]',
    nextDay:  'MMM D, YYYY',
    nextWeek: 'MMM D, YYYY',
    lastDay:  '[Yesterday]',
    lastWeek: 'MMM D, YYYY',
    sameElse: 'MMM D, YYYY'
  });
}

export default helper(todayYesterdayOrDate);
