import {
  moduleForModel,
  test
} from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

moduleForModel('stream', 'Unit | Model | stream', {
  // Specify the other units that are required for this test.
  needs: ['model:story', 'model:playlist']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('it has the required information for sending a listen action', function(assert) {
  assert.expect(2);
  let model = this.subject({});

  let storyPromise = Ember.RSVP.Promise.resolve(Ember.Object.create({
    id: 5,
    itemType: 'episode'
  }));

  let getWrap = sinon.stub(model, 'get')
  getWrap.withArgs('currentStory').returns(storyPromise)
  getWrap.withArgs('cmsPK').returns(123);

  assert.ok(model.forListenAction, "should have forListenAction method");

  Ember.run(() => {
    model.forListenAction({
      custom: 5
    }).then(d => {
      assert.deepEqual(d, {
        custom: 5,
        current_audio_position: 0,
        audio_type: 'livestream',
        cms_id: 5,
        item_type: 'episode',
        stream_id: 123
      });
    });
  })
});
