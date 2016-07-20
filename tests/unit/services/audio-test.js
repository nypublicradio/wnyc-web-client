import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import { installBridge } from 'overhaul/lib/okra-bridge';

// for OkraBridge compat
window.EMBER_TESTING = true;

installBridge();

moduleFor('service:audio', 'Unit | Service | audio', {
  // Specify the other units that are required for this test.
  needs: ['model:story','adapter:story','serializer:story',
          //'model:discover/stores',
          'service:listen-actions',
          'service:poll',
          'service:metrics',
          'service:listen-history'],

  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {} // we only really need the data thing
    });

    startMirage(this.container);

    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session' });
  },
  afterEach() {
    server.shutdown();
  }
});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('passing a pk to play calls playFromPk', function(assert) {
  let service = this.subject();
  function playFromPk() {
    testFlag = true;
  }

  let testFlag = false;

  Ember.run(()=> {
    service.set('playFromPk', playFromPk);
    service.play(1);
  });

  assert.equal(testFlag, true, "should have called playFromPk");
});

test('calling pause calls the okraBridge method', function(assert) {
  let service = this.subject();

  let testFlag = false;
  let okraBridge = {
    pauseSound() {
      testFlag = true;
    },
    teardown() {}
  };

  Ember.run(()=> {
    service.set('okraBridge', okraBridge);
    service.set('currentId', 1);
    service.pause();
  });

  assert.equal(testFlag, true, 'service should have called pause on okraBridge');
});

test('service records a listen when a story is played', function(assert) {
  assert.expect(1);

  let service = this.subject();
  let story = server.create('story');
  let listenStub = {
    addListen({ id }) {
      assert.equal(story.id, id, "service should have called addListen on listen object");
    },
    indexByStoryPk() {}
  };

  Ember.run(()=> {
    service.set('listens', listenStub);
    service.play(story.id);
  });

  return wait();
});

test('it only sets up the player ping once', function(assert) {
  assert.expect(2);

  let counter = 0;
  let service = this.subject();
  let story = server.create('story');
  let pollStub = {
    addPoll({interval, callback, label}) {
      counter++;
      assert.equal(label, 'playerPing', 'the correct poll was added');
    }
  };
  Ember.run(() => {
    service.set('poll', pollStub);
    service.play(story.id);
  });

  return wait().then(() => {
    assert.equal(counter, 1, 'service should only call addPoll once');
  });

});

test('it calls the GoogleAnalytics ping event', function(assert) {
  let done = assert.async();
  let service = this.subject();
  let story = server.create('story');
  let metricsStub = {
    trackEvent() {
      assert.ok(true, 'trackEvent was called');
      done();
    }
  };

  Ember.run(() => {
    service.set('metrics', metricsStub);
    service.set('sessionPing', 500);
    service.play(story.id);
  });

  return wait();
});

test('it sends a listen action on play and not resume', function(assert) {
  assert.expect(1);

  let service = this.subject();
  let story = server.create('story');
  let listenActionStub = {
    sendPlay() {
      assert.ok(true, 'sendPlay was called');
    },
    sendPause() {}
  };
  Ember.run(() => {
    service.set('listenActions', listenActionStub);
    service.play(story.id);
  });

  Ember.run(() => service.pause());

  Ember.run(() => service.play(story.id));

  return wait();
});

test('it sends a listen action on pause', function(assert) {
  let service = this.subject();
  let story = server.create('story');
  let listenActionStub = {
    sendPause() {
      assert.ok(true, 'sendPause was called');
    },
    sendPlay() {}
  };
  Ember.run(() => {
    service.set('listenActions', listenActionStub);
    service.play(story.id);
  });

  Ember.run(() => service.pause());
});

test('it sends a listen action on completed event', function(assert) {
  let service = this.subject();
  let story = server.create('story');
  let listenActionStub = {
    sendComplete() {
      assert.ok(true, 'sendComplete was called');
    }
  };

  Ember.run(() => {
    service.set('listenActions', listenActionStub);
    service.set('currentAudio', story.attrs);
  });
  Ember.run(() => {
    service.okraBridge.onFinished();
  });
});

test('it fires error events', function(assert) {
  assert.expect(2);
  let service = this.subject();
  service.set('errorEvent', () => assert.ok('errorEvent was fired'));
  service.set('flashError', () => assert.ok('flashError was fired'));

  return wait().then(() => {
    /*global Okra*/
    Okra.request('audioService').trigger('player:error');
    Okra.request('audioService').trigger('flashVersionError');
  });
});
