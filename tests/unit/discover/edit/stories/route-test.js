import { moduleFor, test } from 'ember-qunit';

moduleFor('route:discover/edit/stories', 'Unit | Route | discover/edit/stories', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:session']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
