import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | discover/topics', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:discover/topics');
    assert.ok(adapter);
  });
});
