import { camelizeKeys } from 'wnyc-web-client/helpers/camelize-keys';
import { module, test } from 'qunit';

module('Unit | Helper | camelize-keys');

// Replace this with your real tests.
test('it camelizes keys', function(assert) {
  let result = camelizeKeys([{ 'foo-bar': true, foo_baz: true }]);
  assert.deepEqual(result, {fooBar: true, fooBaz: true});
});
