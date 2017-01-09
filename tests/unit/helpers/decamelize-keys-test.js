import { decamelizeKeys } from'wqxr-web-client/helpers/decamelize-keys';
import { module, test } from 'qunit';

module('Unit | Helper | decamelize-keys');

// Replace this with your real tests.
test('it decamelizes keys', function(assert) {
  let result = decamelizeKeys([{ 'fooBar': true, bleepBloopBlop: true }]);
  assert.deepEqual(result, {foo_bar: true, bleep_bloop_blop: true});
});
