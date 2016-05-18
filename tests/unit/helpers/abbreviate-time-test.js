import { abbreviateTime } from 'overhaul/helpers/abbreviate-time';
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
