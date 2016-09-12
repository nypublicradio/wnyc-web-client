import { inExperimentalGroup } from 'overhaul/helpers/in-experimental-group';
import { module, test } from 'qunit';
import { mockExperimentalGroup } from 'overhaul/tests/helpers/mock-experimental-group';

module('Unit | Helper | in experimental group');

test('it checks if you are in a group', function(assert) {
  mockExperimentalGroup(1);
  let result = inExperimentalGroup([1]);
  assert.ok(result, 'it should return true if the api says you are in the selected group');
});
