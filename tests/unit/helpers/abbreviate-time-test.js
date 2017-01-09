import { abbreviateTime } from 'wqxr-web-client/helpers/abbreviate-time';
import { module, test } from 'qunit';

module('Unit | Helper | abbreviate time');

test('it abbreviates minutes to min', function(assert) {
  let result = abbreviateTime(['2 minutes']);
  assert.equal(result, '2 min');
});

test('it abbreviates seconds to sec', function(assert) {
  let result = abbreviateTime(['40 seconds']);
  assert.equal(result, '40 sec');
});

test('it abbreviates hours to hr and minutes to min', function(assert) {
  let result = abbreviateTime(['1 hours 24 minutes']);
  assert.equal(result, '1 hr 24 min');
});

test('it abbreviates singular hour to hr', function(assert) {
  let result = abbreviateTime(['1 hour']);
  assert.equal(result, '1 hr');
});

test('it abbreviates singular minute to min', function(assert) {
  let result = abbreviateTime(['1 hour 1 minute']);
  assert.equal(result, '1 hr 1 min');
});
