import { moduleFor, test } from 'ember-qunit';
import { later } from 'ember-runloop';

moduleFor('service:poll', 'Unit | Service | poll', {

});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it calls a function when you start it', function(assert) {
  let service = this.subject();
  let testFlag = false;
  const interval = 2;
  const delay = 20;

  function setFlag() {
    testFlag = true;
  }

  service.setup(setFlag, interval);
  service.start();

  let done = assert.async();
  later(function() {
    service.stop();
    assert.equal(testFlag, true, "called callback");
    done();
  }, delay);
});

test('it calls a function repeatedly', function(assert) {
  let service = this.subject();
  let callCounter = 0;
  const interval = 2;
  const delay = 100;

  function updateCounter() {
    callCounter++;
  }

  service.setup(updateCounter, interval);
  service.start();

  let done = assert.async();
  later(function() {
    service.stop();
    // this is not a precision tool
    // we don't need to count exact calls/millisecond
    assert.ok(callCounter > 1, "called callback multiple times");
    done();
  }, delay);
});

test('it maintains multiple polls', function(assert) {
  asset.expect(2);

  let service = this.subject();
  let done = assert.async();

  let poll1 = service.addPoll({interval: 200, callback: () => assert.ok('callback called')});
  let poll2 = service.addPoll({interval: 200, callback: () => assert.ok('callback called')});

  later(function() {
    service.stopAll();
  })
});

test('it can cancel multiple polls');

test('it can cancel a poll via Id');

test('it can cancel a poll by label');

test('it can start a poll by Id');

test('it can start a poll by label');
