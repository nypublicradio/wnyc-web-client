import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | discover/edit/shows', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:discover/edit/shows');
    assert.ok(route);
  });
});
