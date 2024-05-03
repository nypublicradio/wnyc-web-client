import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | centennial', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:centennial');
    assert.ok(route);
  });
});
