import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import ENV from 'overhaul/config/environment';

// import wait from 'ember-test-helpers/wait';

let originalGetTime = Date.prototype.getTime;
let testTimestamp = 11112412512521;

moduleFor('service:listen-action', 'Unit | Service | listen action', {
  // Specify the other units that are required for this test.
  needs: ['service:session'],
  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {
        browserId: 'secrets'
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

let queryToHash = function(queryString) {
  var j, q;
  q = queryString.replace(/\?/, "").split("&");
  j = {};
  $.each(q, function(i, arr) {
    arr = arr.split('=');
    return j[arr[0]] = arr[1];
  });
  return j;
};

function testSingleRequest(assert, url, functionToRun, postCallback) {
  var ajaxCalled = false;
  var withCredentials = false;
  var browserId;
  var timeStamp;

  server.post(url, function(schema, request) {
    ajaxCalled = true;
    withCredentials = request.withCredentials;
    browserId = request.queryParams.browser_id;

    let data = queryToHash(request.requestBody);
    timeStamp = data.ts;

    if (postCallback) {
      postCallback(request);
    }
  });

  functionToRun();

  assert.equal(ajaxCalled, true, "should've sent ajax request to play");
  assert.equal(browserId, 'secrets', "browser id should have been passed in");
  assert.equal(withCredentials, true, "ajax should be sent with credentials");
  assert.equal(timeStamp, testTimestamp, "timestamp should have been sent with data");
}

test('sending play action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'play'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendPlay(400);
  });
});

test('sending pause action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'pause'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendPause(400, 20);
  }, function(request) {
    let data = queryToHash(request.requestBody);
    assert.equal(data.value, 20, "should have a value of 20");
  });
});

test('sending skip action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'skip'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendSkip(400);
  });
});

test('sending complete action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'complete'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendComplete(400);
  });
});

test('sending delete action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'delete'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendDelete(400);
  });
});

test('sending heardstream action sends request in correct format', function(assert) {
  let service = this.subject();

  let url = [ENV.wnycAPI, 'api/v1/listenaction/create', 400, 'heardstream'].join("/");
  testSingleRequest(assert, url, function() {
    service.sendHeardStream(400);
  });
});
