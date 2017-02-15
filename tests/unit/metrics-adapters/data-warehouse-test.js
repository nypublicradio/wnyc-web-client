import { moduleFor, test } from 'ember-qunit';

moduleFor('metrics-adapter:data-warehouse', 'data-warehouse adapter', {
  // Specify the other units that are required for this test.
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('it properly transforms object for a reporting channel data', function(assert) {
  let adapter = this.subject();
  let trackingEvent = {
    category: 'Foo',
    action: 'Bar',
    label: 'Baz',
    id: 123,
    type: 'show',
  };
  
  adapter.send = function(d) {
    trackingEvent.cms_id = trackingEvent.id;
    trackingEvent.cms_type = trackingEvent.type;
    delete trackingEvent.id;
    delete trackingEvent.type;
    assert.deepEqual(d, trackingEvent);
  };
  
  adapter.trackEvent(trackingEvent);
});

test('it properly transforms object for reporting story data', function(assert) {
  let adapter = this.subject();
  let trackingEvent = {
    category: 'Foo',
    action: 'Bar',
    label: 'Baz',
    id: 1,
    type: 'story'
  };
  
  adapter.send = function(d) {
    trackingEvent.cms_id = trackingEvent.id;
    trackingEvent.cms_type = trackingEvent.type;
    delete trackingEvent.id;
    delete trackingEvent.type;
    assert.deepEqual(d, trackingEvent);
  };
  
  adapter.trackEvent(trackingEvent);
});
