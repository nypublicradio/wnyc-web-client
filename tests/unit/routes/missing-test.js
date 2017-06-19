import { moduleFor, test } from 'ember-qunit';

moduleFor('route:missing', 'Unit | Route | missing', {
  needs: ['service:metrics', 'service:session', 'service:data-pipeline']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
