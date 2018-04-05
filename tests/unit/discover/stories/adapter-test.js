import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | discover/stories', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:discover/stories');
    assert.ok(adapter);
  });
});
