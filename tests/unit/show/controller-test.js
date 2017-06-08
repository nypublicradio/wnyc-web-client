import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:show', 'Unit | Controller | show', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:session', 'service:data-pipeline']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
