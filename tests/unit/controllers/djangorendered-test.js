import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:djangorendered', 'Unit | Controller | django rendered', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
