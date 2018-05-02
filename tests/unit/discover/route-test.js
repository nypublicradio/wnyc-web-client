import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | discover', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:discover');
    assert.ok(route);
  });
});
