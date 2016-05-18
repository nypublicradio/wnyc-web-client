import { humanizeDuration } from 'overhaul/helpers/humanize-duration';
import { module, test } from 'qunit';

module('Unit | Helper | humanize duration');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = humanizeDuration([42]);
  assert.ok(result);
});


// Replace this with your real tests.
test('more than 60 seconds displays as minutes', function(assert) {
  let result = humanizeDuration([150, 'seconds']);

  assert.equal(result, "3 minutes");
});

// Replace this with your real tests.
test('less than 60 seconds displays as seconds', function(assert) {
  let result = humanizeDuration([40, 'seconds']);

  assert.equal(result, "40 seconds");
});

// Replace this with your real tests.
test('more than 3600 seconds displays as hours', function(assert) {
  let result = humanizeDuration([3650, 'seconds']);

  assert.equal(result, "1 hour");
});
