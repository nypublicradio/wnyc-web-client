import { arrayContains } from 'overhaul/helpers/array-contains';
import { module, test } from 'qunit';

module('Unit | Helper | array contains');

test('it returns true if the array contains the item', function(assert) {
  let ary = [1,2,3,4];
  let result = arrayContains([ary, 4]);
  assert.equal(result, true, "does contain the item");
});

test('it returns false if the array does not contain the item', function(assert) {
  let ary = [1,2,3,4];
  let result = arrayContains([ary, 5]);
  assert.equal(result, false, "does not contain the item");
});
