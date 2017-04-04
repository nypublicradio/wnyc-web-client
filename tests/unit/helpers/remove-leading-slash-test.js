
import { removeLeadingSlash } from 'wqxr-web-client/helpers/remove-leading-slash';
import { module, test } from 'qunit';

module('Unit | Helper | remove leading slash');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = removeLeadingSlash(['/musicians/maya-beiser/']);
  assert.equal('musicians/maya-beiser/', result, "should remove leading slash");
});

