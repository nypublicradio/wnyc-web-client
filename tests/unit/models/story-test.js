import { moduleForModel, test } from 'ember-qunit';

moduleForModel('story', 'Unit | Model | story', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('segment management', function(assert) {
  let model = this.subject({ audio: 'foo.mp3' });
  assert.equal(model.getNextSegment(), null, 'getNextSegment returns null if there are no segments');
  assert.equal(model.getCurrentSegment(), model.get('audio'), 'getCurrentSegment returns the audio field if there are no segments');
  
  Ember.run(() => {
    model.set('audio', ['foo', 'bar']);
  });
  
  assert.equal(model.hasNextSegment(), true, 'if we are not on the last segment, report false');
  assert.equal(model.getCurrentSegment(), 'foo', 'currentSegment should be foo');
  
  assert.equal(model.getNextSegment(), 'bar', 'nextSegment should be bar');
  assert.equal(model.getCurrentSegment(), 'bar', 'calling getCurrentSegment after getNextSegment should return the incremented value');
  assert.equal(model.hasNextSegment(), false, 'if we are on the last segment, report false');
  
  assert.equal(model.getNextSegment(), 'foo', 'calling getNextSegment at the end of the list should wrap around');
  model.getNextSegment();
  model.resetSegments();
  assert.equal(model.getCurrentSegment(), 'foo', 'currentSegment should be foo');
});
