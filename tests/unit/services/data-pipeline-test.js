import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('service:data-pipeline', 'Unit | Service | data pipeline', {
  // Specify the other units that are required for this test.
  needs: ['service:session', 'service:poll'],
  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {
        browserId: 'secrets'
      },

      syncBrowserId: function() {
        return Ember.RSVP.Promise.resolve('secrets');
      }
    });

    this.register('service:session', sessionStub);
    this.inject.service('session');
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it reports the proper data for an item view', function(assert) {
  let testData = {cms_id: 1, item_type: 'story', site_id: 1};
  let expected = Object.assign({
    browser_id: 'secrets',
    client: 'wnyc_web',
    referrer: null,
    url: location.toString()
  }, testData);
  
  let service = this.subject({
    browserId: 'secrets',
    _send(data) {
      assert.deepEqual(expected, data, 'passes in correct data to send');
    },
    _legacySend() {}
  });
  
  service.reportItemView(testData);
});

test('it reports the proper data for ondemand listen actions', function(assert) {
  let clock = sinon.useFakeTimers();
  let expected = {
    audio_type: 'ondemand',
    client: 'wnyc_web',
    delta: 0,
    current_position: 0,
    browser_id: 'secrets',
    referrer: null,
    url: location.toString(),
    cms_id: 1,
    item_type: 'story',
    site_id: 1
  };
  let testData = {cms_id: 1, item_type: 'story', site_id: 1};
  
  let service = this.subject({
    browserId: 'secrets',
    _legacySend() {}
  });
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'start'}, expected);
    assert.deepEqual(thisData, data, 'sendStart passes in correct data');
  };
  service.reportListenAction('start', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'pause'}, expected);
    assert.deepEqual(thisData, data, 'sendPause passes in correct data');
  };
  service.reportListenAction('pause', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'resume'}, expected);
    assert.deepEqual(thisData, data, 'sendResume passes in correct data');
  };
  service.reportListenAction('resume', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'skip_15_forward'}, expected);
    assert.deepEqual(thisData, data, 'sendSkipForward passes in correct data');
  };
  service.reportListenAction('forward_15', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'skip_15_back'}, expected);
    assert.deepEqual(thisData, data, 'sendSkipBackward passes in correct data');
  };
  service.reportListenAction('back_15', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'window_close'}, expected);
    assert.deepEqual(thisData, data, 'sendWindowClose passes in correct data');
  };
  service.reportListenAction('close', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'finish'}, expected);
    assert.deepEqual(thisData, data, 'sendFinish passes in correct data');
  };
  service.reportListenAction('finish', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  service._send = function(data) {
    let thisData = Object.assign({action: 'set_position'}, expected);
    assert.deepEqual(thisData, data, 'sendSetPosition passes in correct data');
  };
  service.reportListenAction('position', Object.assign({audio_type: 'ondemand', current_position: 0}, testData));
  
  clock.restore();
});

test('data pipeline tracks delta properly', function(assert) {
  assert.expect(3);
  
  let clock = sinon.useFakeTimers();
  let deltaShouldbe = 500;
  let service = this.subject({
    _send({action, delta}) {
      if (/start|resume/.test(action)) {
        assert.equal(delta, 0, 'delta should be 0 on start and resumes');
      } else {
        assert.equal(delta, deltaShouldbe, 'delta should be updated as time ticks');
      }
    },
    _legacySend() {}
  });
  service.reportListenAction('start');
  
  clock.tick(deltaShouldbe);
  service.reportListenAction('pause');
  
  clock.tick(1000);
  service.reportListenAction('resume');
  
  clock.restore();
});
