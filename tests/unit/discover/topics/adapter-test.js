import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:discover/topics', 'Unit | Adapter | discover/topics', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('it uses the topics API', function(assert) {
  let adapter = this.subject();
  assert.equal(adapter.namespace, "api/v1/discover/topics");
});
