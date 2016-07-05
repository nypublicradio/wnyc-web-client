import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';

const okraStub = {
  playSoundFor() {}
};

moduleFor('service:audio', 'Unit | Service | audio', {
  // Specify the other units that are required for this test.
  needs: ['model:story','adapter:story','serializer:story',
          //'model:discover/stores',
          'service:poll',
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
    }
  };

  Ember.run(()=> {
    service.set('okraBridge', okraBridge);
    service.pause();
  });

  assert.equal(testFlag, true, 'service should have called pause on okraBridge');
});

test('service records a listen when a story is played', function(assert) {
  let service = this.subject();
  var storySentToListen;
  let listenStub = {
    addListen(story) {
      storySentToListen = story;
    },
    indexByStoryPk(){}
  };

  Ember.run(()=> {
    service.set('listens', listenStub);
    let currentAudioStub = {
      id: 2
    };
    service.set('currentAudio', currentAudioStub);
    service.set('okraBridge', okraStub);
    service.play();
  });

  return wait().then(() => {
    assert.equal(storySentToListen.id, 2, "service should have called addListen on listen object");
  });
});

test('it only sets up the player ping once', function(assert) {
  assert.expect(2);

  let counter = 0;
  let service = this.subject();
  let pollStub = {
    addPoll({interval, callback, label}) {
      counter++;
      assert.equal(label, 'playerPing');
    }
  };
  Ember.run(() => {
    service.set('poll', pollStub);
    service.set('okraBridge', okraStub);
    service.play(1);
  });

  return wait().then(() => {
    assert.equal(counter, 1, 'service should only call addPoll once');
  });

});


// TODO: fix this. This fails half the time due to a destroyed object error when
// the model bridge tries to set isReady on the service

// test('it sets currently playing id when playing', function(assert) {
//   var promise = new Ember.RSVP.Promise(function(resolve, reject){
//     window.Okra.on('initialize:after', function() {
//       resolve();
//     });
//     window.XDPlayer.on('initialize:after', function() {
//       window.Okra.start();
//     });
//     window.XDPlayer.start();
//   });
//
//   let service = this.subject();
//   let story = server.create('discover-story');
//   server.createList('show', 5);
//   server.createList('story', 5);
//
//   return promise.then(() => {
//     service.playOnDemand(story.id);
//
//     return wait().then(() => {
//       assert.equal(service.get('currentAudio.id'), story.id);
//     });
//   });
// });
