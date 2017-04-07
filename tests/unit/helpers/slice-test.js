
import { slice } from 'wqxr-web-client/helpers/slice';
import { module, test } from 'qunit';

module('Unit | Helper | slice');

// Replace this with your real tests.
test('it works', function(assert) {
  let list = [1, 2, 3, 4];
  let first3 = slice([list, 0, 3]);
  assert.deepEqual(first3, [1, 2, 3]);
  
  let twoToEnd = slice([list, 1]);
  assert.deepEqual(twoToEnd, [2, 3, 4]);
  
  let empty = slice([list, 2, 2]);
  assert.deepEqual(empty, []);
});
