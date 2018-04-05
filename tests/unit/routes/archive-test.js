import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | archive', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:archive');
    assert.ok(route);
  });
});
