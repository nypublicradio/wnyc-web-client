import { moduleForModel, test } from 'ember-qunit';

moduleForModel('producing-organization', 'Unit | Model | producing organization', {
  // Specify the other units that are required for this test.
  needs: ['model:image']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
