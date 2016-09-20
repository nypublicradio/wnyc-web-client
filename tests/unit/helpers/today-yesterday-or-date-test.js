import moment from 'moment';
import { todayYesterdayOrDate } from 'overhaul/helpers/today-yesterday-or-date';
import { module, test } from 'qunit';

module('Unit | Helper | today yesterday or date');

test('it returns today for current date', function(assert) {
  const startOfToday = moment().startOf('day').format();
  const endOfToday = moment().endOf('day').format();
  assert.equal(todayYesterdayOrDate([startOfToday]), 'Today', 'it should return the string Today for start of Today');
  assert.equal(todayYesterdayOrDate([endOfToday]), 'Today', 'it should return the string Today for end of Today');
});

test('it returns yesterday for yesterdays date', function(assert) {
  const yesterday = moment().subtract(1, 'days');
  const startOfYesterday = yesterday.startOf('day').format();
  const endOfYesterday = yesterday.endOf('day').format();
  assert.equal(todayYesterdayOrDate([startOfYesterday]), 'Yesterday', 'it should return the string Yesterday for start of Yesterday');
  assert.equal(todayYesterdayOrDate([endOfYesterday]), 'Yesterday', 'it should return the string Yesterday for end of Yesterday');
});

test('it returns date for other days', function(assert) {
  const tomorrow = moment().add(1, 'days').format();
  const twoDaysAgo = moment().subtract(2, 'days').format();
  const oneYearAgo = moment().subtract(1, 'years').format();
  assert.equal(todayYesterdayOrDate([tomorrow]), moment(tomorrow).format('MMM D, YYYY'), 'it should return the date string');
  assert.equal(todayYesterdayOrDate([twoDaysAgo]), moment(twoDaysAgo).format('MMM D, YYYY'), 'it should return the date string');
  assert.equal(todayYesterdayOrDate([oneYearAgo]), moment(oneYearAgo).format('MMM D, YYYY'), 'it should return the date string');
});


