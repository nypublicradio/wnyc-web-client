import { moduleFor, test } from 'ember-qunit';
import run from 'ember-runloop';

moduleFor('controller:profile', 'Unit | Controller | profile', {
  // Specify the other units that are required for this test.
  needs: ['service:metrics', 'service:session', 'service:data-pipeline']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  run(() => {
    let controller = this.subject();
    assert.ok(controller);
  });
});
