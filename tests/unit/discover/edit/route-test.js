import { moduleFor, test } from 'ember-qunit';

moduleFor('route:discover/edit', 'Unit | Route | discover/edit', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:session', 'service:data-pipeline']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
