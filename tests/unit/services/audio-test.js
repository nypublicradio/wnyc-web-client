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
          'model:discover/stories',
          'service:poll',
          'service:listen-history'
        ],

  beforeEach() {
    const bumperState = Ember.Service.extend({
      revealNotificationBar: false,
      isEnabled: false
    });

    const featureStub = Ember.Service.extend({
      isEnabled() {
        return false;
      }
    });

    const sessionStub = Ember.Service.extend({
      data: {} // we only really need the data thing
    });
    const listenActionsStub = Ember.Service.extend({
      sendPause: function(){},
      sendComplete: function(){},
      sendPlay: function(){},
      sendSkip: function(){},
      sendDelete: function(){}
    });
    const metricsStub = Ember.Service.extend({
      trackEvent() {}
    });
    startMirage(this.container);

    this.register('service:features', featureStub);
    this.inject.service('features');

    this.register('service:bumper-state', bumperState);
    this.inject.service('bumper-state', { as: 'bumperState' });

    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session' });

    this.register('service:listen-actions', listenActionsStub);
    this.inject.service('listen-actions', { as: 'listen-actions' });

    this.register('service:metrics', metricsStub);
    this.inject.service('metrics');
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
  let done = assert.async();
  let service = this.subject();

  function playFromPk() {
    assert.ok(true, "should have called playFromPk");
    done();
  }

  service.set('playFromPk', playFromPk);
  service.play(1);
});

test('calling pause calls the okraBridge method', function(assert) {
  let service = this.subject();

  let testFlag = false;
  let okraBridge = {
    pauseSound() {
      testFlag = true;
    },
    teardown() {},
    off() {}
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

  service.set('metrics', metricsStub);
  service.set('sessionPing', 500);
  service.play(story.id);
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
  return wait();
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
    service.set('play', () => {});
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

test('it delays early calls to play until after okraBrige isReady', function(assert) {

  let id = 123;
  server.create('story', {id});
  let otherId = 456;
  server.create('story', {id: otherId});

  let service = this.subject();
  assert.notOk(service.get('okraBridge.isReady'), 'okra not ready yet');
  service.play(id);
  assert.deepEqual(service.get('_waitingForOkra'), {id, context: ''}, 'holds onto last played item');

  return wait().then(() => {
    assert.equal(service.get('_waitingForOkra'), null, 'clears private attr');
    service.play(otherId);
    assert.equal(service.get('currentId'), otherId, 'plays afterwards OK');

    return wait();
  });
});

// TODO: skip until we merge in stream mirage factories
// moduleFor('service:audio', 'Unit | Service | Audio Analytics', {
//   // Specify the other units that are required for this test.
//   needs: ['model:story','adapter:story','serializer:story',
//           'model:discover/stories',
//           'service:listen-actions',
//           'service:poll',
//           'service:metrics',
//           'service:listen-history'],
//
//   beforeEach() {
//     const sessionStub = Ember.Service.extend({
//       data: {} // we only really need the data thing
//     });
//     const listenActionsStub = Ember.Service.extend({
//       sendPause: function(){},
//       sendComplete: function(){},
//       sendPlay: function(){},
//       sendSkip: function(){},
//       sendDelete: function(){}
//     });
//     startMirage(this.container);
//
//     this.register('service:session', sessionStub);
//     this.inject.service('session', { as: 'session' });
//
//     this.register('service:listen-actions', listenActionsStub);
//     this.inject.service('listen-actions', { as: 'listen-actions' });
//
//   },
//   afterEach() {
//     server.shutdown();
//     delete window.ga;
//   }
// });
//
// test('it sends npr events', function(assert) {
//   window.ga = function() {
//     debugger;
//   }
//   let stream = server.create('stream');
//
//   Ember.run(() => {
//     service.playStream(stream.slug);
//   })
//
// });
