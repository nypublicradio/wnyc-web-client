import { humanizeDuration } from 'overhaul/helpers/humanize-duration';
import { module, test } from 'qunit';

module('Unit | Helper | humanize duration');
test('it works', function(assert) {
  let result = humanizeDuration([42]);
  assert.ok(result);
});

test('more than 60 seconds displays as minutes', function(assert) {
  let result = humanizeDuration([150, 'seconds']);

  assert.equal(result, "3 minutes");
});

test('less than 60 seconds displays as seconds', function(assert) {
  let result = humanizeDuration([40, 'seconds']);

  assert.equal(result, "40 seconds");
});

test('more than 3600 seconds displays as hours', function(assert) {
  let result = humanizeDuration([3650, 'seconds']);

  assert.equal(result, "1 hour");
});

test('it should not round 57 minutes up to an hour', function(assert) {
  let result = humanizeDuration([(60*57), 'seconds']);

  assert.equal(result, "57 minutes");
});

test('it should not round 1 hour 3 minutes down to an hour', function(assert) {
  let result = humanizeDuration([(60*63), 'seconds']);

  assert.equal(result, "1 hour 3 minutes");
});
