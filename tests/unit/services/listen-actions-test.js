import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import ENV from 'wnyc-web-client/config/environment';
// import wait from 'ember-test-helpers/wait';

let originalGetTime = Date.prototype.getTime;
let testTimestamp = 11112412512521;

moduleFor('service:listen-actions', 'Unit | Service | listen-actions', {
  // Specify the other units that are required for this test.
  needs: ['service:session'],
  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {
        browserId: 'secrets'
      },

      syncBrowserId: function() {
        return new Ember.RSVP.Promise((resolve) => {
          resolve('secrets');
        });
      }
    });

    Date.prototype.getTime = function() {
      return testTimestamp;
    };

    startMirage(this.container);

    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session' });
  },
  afterEach() {
    server.shutdown();
    Date.prototype.getTime = originalGetTime;
  }
});

function testSingleRequest(assert, url, functionToRun, postCallback) {
  var ajaxCalled = false;
  var withCredentials = false;
  var browserId;
  var timeStamp;
  var context;

  server.post(url, function(schema, request) {
    ajaxCalled = true;
    withCredentials = request.withCredentials;
    browserId = request.queryParams.browser_id;
    context = request.queryParams.context;
    let data = JSON.parse(request.requestBody);
    timeStamp = data.ts;

    if (postCallback) {
      postCallback(request);
    }
  });

  Ember.run(() => {
    functionToRun();
  });

  assert.equal(ajaxCalled, true, "should've sent ajax request to play");
  assert.equal(browserId, 'secrets', "browser id should have been passed in");
  assert.equal(withCredentials, true, "ajax should be sent with credentials");
  assert.equal(timeStamp, Math.floor(testTimestamp / 1000), "timestamp should have been sent with data");
  assert.equal(context, 'context-key', "context should have been sent with data");
}

test('sending play action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create/', 400, 'play'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendPlay(400, 'context-key');
  });
});

test('sending pause action sends request in correct format', function(assert) {
  assert.expect(6);

  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', 400, 'pause'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendPause(400, 'context-key', 20);
  }, function(request) {
    let data = JSON.parse(request.requestBody);
    assert.equal(data.value, 20, "should have a value of 20");
  });
});

test('sending skip action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', 400, 'skip'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendSkip(400, 'context-key');
  });
});

test('sending complete action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', 400, 'complete'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendComplete(400, 'context-key');
  });
});

test('sending delete action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', 400, 'delete'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendDelete(400, 'context-key');
  });
});

test('sending heardstream action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', 400, 'heardstream'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendHeardStream(400, 'context-key');
  });
});

test('sending multiple actions queues them up and sends them as one request', function(assert) {
  let service = this.subject();

  var ajaxCalled = false;
  var withCredentials = false;
  var browserId;
  var invalidCallCount = 0;
  let baseUrl = [ENV.wnycAccountRoot, 'api/v1/listenaction/create'].join("/");
  var actions = [];

  server.post(baseUrl, function(schema, request) {
    let data = JSON.parse(request.requestBody);
    ajaxCalled = true;
    withCredentials = request.withCredentials;
    browserId = data.browser_id;
    actions = data.actions;
  });

  server.post([baseUrl, '*'].join("/"), function(/*schema, request*/) {
    invalidCallCount = invalidCallCount + 1;
  });

  Ember.run(() => {
    service.sendDelete(400, 'context-key');
    service.sendDelete(401, 'context-key');
    service.sendPlay(405, 'context-key');
    service.sendDelete(402, 'context-key');
    service.sendDelete(404, 'context-key');
  });

  Ember.run(() => {
    assert.equal(ajaxCalled, true, "should've sent ajax request to play");
    assert.equal(browserId, 'secrets', "browser id should have been passed in");
    assert.equal(withCredentials, true, "ajax should be sent with credentials");
    assert.equal(invalidCallCount, 0, "individual request should not have been called");
    assert.equal(actions.length, 5);
    assert.equal(actions.filterBy('action', 'delete').length, 4, "should be four delete actions");
    assert.equal(actions.filterBy('action', 'play').length, 1, "should be one play action");
    assert.deepEqual(actions.mapBy('pk'), [400, 401, 405, 402, 404], "should have supplied pks");
    assert.deepEqual(actions.mapBy('context'), ['context-key', 'context-key','context-key','context-key','context-key',], "should have supplied contexts");

    let t = Math.floor(testTimestamp / 1000);
    assert.deepEqual(actions.mapBy('ts'), [t,t,t,t,t], "should all have timestamps");
  });
});
