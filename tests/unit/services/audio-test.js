import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import hifiNeeds from 'wnyc-web-client/tests/helpers/hifi-needs';
import sinon from 'sinon';

import DummyConnection from 'ember-hifi/hifi-connections/dummy-connection';

moduleFor('service:audio', 'Unit | Service | audio', {
  // Specify the other units that are required for this test.
  needs: [...hifiNeeds,
          'model:story','adapter:story','serializer:story',
          'model:stream','adapter:stream','serializer:stream',
          'model:discover/stories',
          'service:features',
          'service:bumper-state',
          'service:poll',
          'service:metrics',
          'service:data-pipeline',
          'service:listen-queue',
          'service:listen-history'],

  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {browserId: 'secrets'}, // we only really need the data thing
      authorize: function() {},
    });
    const metricsStub = Ember.Service.extend({
      trackEvent() {}
    });
    const bumperStub = Ember.Service.extend({
      autoplayEnabled: false
    });
    startMirage(this.container);

    this.register('service:session', sessionStub);
    this.inject.service('session');

    this.register('service:metrics', metricsStub);
    this.inject.service('metrics');

    this.register('service:bumper-state', bumperStub);
    this.inject.service('bumper-state');
  },
  afterEach() {
    server.shutdown();
  }
});

const hifiStub = {
  play(promise) {
    return Ember.RSVP.Promise.resolve(promise);
  },
  pause() {}
};

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

test('can switch from on demand to stream and vice versa', function(assert) {
  assert.expect(4);

  const onDemandUrl = '/url.mp3';
  let story = server.create('story', { audio: onDemandUrl });
  let stream = server.create('stream');
  let streamURL = stream.attrs.urls.rtsp;
  let audio1 = DummyConnection.create({ url: onDemandUrl });
  let audio2 = DummyConnection.create({ url: streamURL  });
  let service = this.subject();
  let done = assert.async();
  
  service.get('hifi.soundCache').cache(audio1);
  service.get('hifi.soundCache').cache(audio2);

  Ember.run(() => {
    service.play(story.id).then(({sound}) => {
      assert.equal(sound.get('url'), onDemandUrl, 'story played OK');
    }).then(() => {
      service.play(stream.slug).then(({sound}) => {
        assert.equal(sound.get('url'), streamURL, 'switched to stream OK');
        service.play(stream.slug).then(({sound}) => {
          assert.equal(sound.get('url'), streamURL, 'stream played OK');
        }).then(() => {
          service.play(story.id).then(({sound}) => {
            assert.equal(sound.get('url'), onDemandUrl, 'switched to on demand OK');
            done();
          });
        });
      });
    });
  });
  return wait();
});

test('playing a story with a list of urls plays them in order', function(assert) {
  assert.expect(2);

  let url1 = '/url1.mp3';
  let url2 = '/url2.mp3';
  let audio1 = DummyConnection.create({ url: url1 });
  let audio2 = DummyConnection.create({ url: url2 });
  let episode = server.create('story', {
    audio: [url1, url2]
  });
  let service = this.subject();
  service.get('hifi.soundCache').cache(audio1);
  service.get('hifi.soundCache').cache(audio2);

  Ember.run(() => {
    service.play(episode.id).then(() => {
      assert.equal(service.get('hifi.currentSound.url'), url1, 'first audio should be playing');
      audio1.trigger('audio-ended');
    });
  });

  audio2.on('audio-played', function() {
    assert.equal(service.get('hifi.currentSound.url'), url2, 'second audio should be playing');
  });

  return wait();
});

test('playing a segment directly starts from 0', function(assert) {
  const ONE_MINUTE = 1000 * 60;
  let url = '/audio.mp3';
  let audio = DummyConnection.create({
    url,
    duration: 30 * ONE_MINUTE
  });
  let segment = server.create('story', { audio: url });
  let episode = server.create('story', { audio: [url] });
  let service = this.subject();
  let done = assert.async();

  service.get('hifi.soundCache').cache(audio);
  Ember.run(() => {
    service.play(episode.id).then(() => {
      service.setPosition(0.5);
      assert.equal(service.get('position'), (30 * ONE_MINUTE) / 2, 'position on episode audio successfully set');

      service.play(segment.id).then(() => {
        assert.equal(service.get('position'), 0, 'audio position should be reset to 0');
        assert.equal(service.get('hifi.currentSound.url'), url, 'url should be segment url');
        done();
      });
    });
  });
});

test('pausing audio picks up from where it left off', function(assert) {
  const ONE_MINUTE = 1000 * 60;
  let url = '/audio.mp3';
  let audio = DummyConnection.create({
    url,
    duration: 30 * ONE_MINUTE
  });
  let story = server.create('story', { audio: url });
  let service = this.subject();

  service.get('hifi.soundCache').cache(audio);
  Ember.run(() => {
    service.play(story.id).then(() => {
      service.setPosition(0.5);
      assert.equal(service.get('position'), (30 * ONE_MINUTE) / 2, 'position on episode audio successfully set');
      service.pause();
      service.play(story.id).then(() => {
        assert.equal(service.get('position'), (30 * ONE_MINUTE) / 2, 'audio picks up where it left off');
      });
    });
  });

  return wait();
});

test('pausing segemented audio picks up from where it left off', function(assert) {
  const ONE_MINUTE = 1000 * 60;
  let url = '/audio.mp3';
  let audio = DummyConnection.create({
    url,
    duration: 30 * ONE_MINUTE
  });
  let episode = server.create('story', { audio: [url] });
  let service = this.subject();

  service.get('hifi.soundCache').cache(audio);
  Ember.run(() => {
    service.play(episode.id).then(() => {
      service.setPosition(0.5);
      assert.equal(service.get('position'), (30 * ONE_MINUTE) / 2, 'position on episode audio successfully set');
      service.pause();
      service.play(episode.id).then(() => {
        assert.equal(service.get('position'), (30 * ONE_MINUTE) / 2, 'audio picks up where it left off');
      });
    });
  });

  return wait();
});

test('segmented audio management', function(assert) {
  let done = assert.async();
  assert.expect(4);

  const ONE_MINUTE = 1000 * 60;
  let url1 = '/url1.mp3';
  let duration1 = 30 * ONE_MINUTE;
  let audio1 = DummyConnection.create({
    url: url1,
    duration: duration1
  });
  
  let url2 = '/url2.mp3';
  let duration2 = 20 * ONE_MINUTE;
  let audio2 = DummyConnection.create({
    url: url2,
    duration: duration2
  });
  
  let url3 = '/url3.mp3';
  let duration3 = 20 * ONE_MINUTE;
  let audio3 = DummyConnection.create({
    url: url3,
    duration: duration3
  });
  let episode = server.create('story', {
    audio: [url1, url2]
  });
  let segment = server.create('story', { audio: url2 });
  let story = server.create('story', { audio: url3 });
  let service = this.subject();

  service.get('hifi.soundCache').cache(audio1);
  service.get('hifi.soundCache').cache(audio2);
  service.get('hifi.soundCache').cache(audio3);
  Ember.run(() => {
    service.play(segment.id).then(() => {
      Ember.run(() => service.setPosition(0.5));
      assert.equal(service.get('position'), audio2.get('duration') / 2, 'position on segment audio successfully set');

      service.play(episode.id).then(() => {
        audio1.trigger('audio-ended');
      });

      audio2.one('audio-played', function() {
        assert.equal(service.get('position'), 0, 'second audio should start from 0');
        Ember.run(() => service.setPosition(0.5));

        service.play(story.id).then(() => {
          service.play(episode.id).then(() => {
            assert.equal(service.get('hifi.currentSound.url'), url1, 'first segment should be playing');
            assert.equal(service.get('position'), 0, 'should start from 0');
            done();
          });
        });
      });
    });
  });

  return wait();
});

test('episodes played from the queue do not continue to the next item until the episode has finished all its segments', function(assert) {
  let url1 = '/url1.mp3';
  let audio1 = DummyConnection.create({ url: url1 });
  let url2 = '/url2.mp3';
  let audio2 = DummyConnection.create({ url: url2 });
  let url3 = '/url3.mp3';
  let audio3 = DummyConnection.create({ url: url3 });
  let episodeToQueue = server.create('story', {
    audio: [url1, url2]
  });
  let nextStory = server.create('story', { audio: url3 });

  let service = this.subject();
  service.get('hifi.soundCache').cache(audio1);
  service.get('hifi.soundCache').cache(audio2);
  service.get('hifi.soundCache').cache(audio3);

  let hifiSpy = sinon.spy(service.get('hifi'), 'play');
  let queueSpy = sinon.spy(service, 'playNextInQueue');
  let audio3Spy = sinon.spy(audio3, 'play');

  Ember.run(() => {
    service.addToQueue(episodeToQueue.id);
    service.addToQueue(nextStory.id);

    service.play(episodeToQueue.id, 'queue').then(() => {
      assert.equal(service.get('hifi.currentSound.url'), url1, 'first audio file should be playing');
      audio1.trigger('audio-ended');
    });

    audio2.on('audio-played', function() {
      assert.equal(hifiSpy.callCount, 2, 'should only call play twice');
      assert.equal(audio3Spy.callCount, 0, 'audio3 should not be played');
      assert.equal(queueSpy.callCount, 0, 'nothing new should be queued by now');

      Ember.run.next(() => audio2.trigger('audio-ended'));
    });

    audio2.on('audio-ended', function() {
      audio2.ended = true;
    });

    audio3.on('audio-played', function() {
      assert.equal(hifiSpy.callCount, 3, 'play called 3 times');
      assert.equal(audio3Spy.callCount, 1, 'audio3 should be played once');
      assert.equal(queueSpy.callCount, 1, 'audio should have been qeueued up');
      assert.ok(audio2.ended, 'audio2 should have ended before starting');
    });

  });

  return wait();

});


test('can play a segmented story all the way through more than once', function(assert) {
  let url1 = '/url1.mp3';
  let audio1 = DummyConnection.create({ url: url1 });
  
  let url2 = '/url2.mp3';
  let audio2 = DummyConnection.create({ url: url2 });
  let episode = server.create('story', {
    audio: [url1, url2]
  });

  let service = this.subject();
  service.get('hifi.soundCache').cache(audio1);
  service.get('hifi.soundCache').cache(audio2);

  Ember.run(() => {
    service.play(episode.id).then(() => audio1.trigger('audio-ended'));
  });

  audio2.one('audio-played', function() {
    audio2.trigger('audio-ended');
    Ember.run.next(() => {
      service.play(episode.id).then(() => assert.ok('can play twice'));
    });
  });

  return wait();
});

test('service passes correct attrs to data pipeline to report an on_demand listen action', function(assert) {

  let done = assert.async();
  let audio = DummyConnection.create({
    url: '/audio.mp3',
    duration: 30 * 60 * 1000
  });
  let audio2 = DummyConnection.create({
    url: '/audio2.mp3',
    duration: 30 * 60 * 1000
  });
  let story = server.create('story', { audio: '/audio.mp3' });
  let story2 = server.create('story', { audio: '/audio2.mp3' });
  let reportStub = sinon.stub();
  let service = this.subject({
      dataPipeline: {
        reportListenAction: reportStub
      }
  });
  service.get('hifi.soundCache').cache(audio);
  service.get('hifi.soundCache').cache(audio2);
  let expected = {
    audio_type: 'on_demand',
    cms_id: story.id,
    current_audio_position: 0,
    item_type: story.itemType,
  };
    
  Ember.run(() => {
    service.play(story.id).then(() => {
      let forwardPosition = {current_audio_position: service.get('position')};
      service.fastForward();
      let rewindPosition = {current_audio_position: service.get('position')};
      service.rewind();
      let setPosition = {current_audio_position: service.get('position')};
      service.setPosition(0.5);
      service.pause();
      let pausePosition = {current_audio_position: service.get('position')};
      service.play(story.id).then(() => {
        service.play(story2.id).then(() => {
          let setPosition2 = {current_audio_position: service.get('position')};
          service.setPosition(0.75);
          service.finishedTrack();
          let finishedPosition = {current_audio_position: service.get('position')};
          wait().then(() => {
            assert.equal(reportStub.callCount, 10);

            assert.deepEqual(
              reportStub.getCall(0).args,
              ['start', expected]
            );

            assert.deepEqual(
              reportStub.getCall(1).args,
              ['forward_15', Object.assign(expected, forwardPosition)],
              'current_audio_position should be time when action happened, not target time'
            );

            assert.deepEqual(
              reportStub.getCall(2).args,
              ['back_15', Object.assign(expected, rewindPosition)],
              'current_audio_position should be time when action happened, not target time'
            );
            
            assert.deepEqual(
              reportStub.getCall(3).args,
              ['position', Object.assign(expected, setPosition)],
              'current_audio_position should be time when action happened, not target time'
            );

            assert.deepEqual(
              reportStub.getCall(4).args,
              ['pause', Object.assign(expected, pausePosition)]
            );

            assert.deepEqual(
              reportStub.getCall(5).args,
              ['resume', Object.assign(expected, pausePosition)]
            );

            assert.deepEqual(
              reportStub.getCall(6).args,
              ['interrupt', Object.assign(expected, pausePosition)]
            );

            // now we're dealing with story 2
            assert.deepEqual(
              reportStub.getCall(7).args,
              ['start', Object.assign(expected, {cms_id: story2.id, current_audio_position: 0})]
            );
            
            assert.deepEqual(
              reportStub.getCall(8).args,
              ['position', Object.assign(expected, setPosition2)],
              'current_audio_position should be time when action happened, not target time'
            );

            assert.deepEqual(
              reportStub.getCall(9).args,
              ['finish', Object.assign(expected, finishedPosition)]
            );
            
            done();
          });
        });
      });
    });
  });
});

test('service passes correct attrs to data pipeline to report a livestream listen action', function(assert) {

  let done = assert.async();
  let reportStub = sinon.stub();
  let service = this.subject({
      dataPipeline: {
        reportListenAction: reportStub
      }
  });
  let currentStory = server.create('story');
  let stream = server.create('stream');
  server.create('whats-on', {
    current_show: { episode_pk: currentStory.id }
  });
  let audio = DummyConnection.create({ url: stream.attrs.urls.rtsp });
  
  let expected = {
    audio_type: 'stream',
    cms_id: currentStory.id,
    item_type: currentStory.itemType,
    stream_id: stream.slug,
    current_audio_position: 0
  };
    
  service.get('hifi.soundCache').cache(audio);
  
  Ember.run(() => {
    service.play(stream.slug).then(() => {
      service.position = 500;
      service.pause();
      service.play(stream.slug).then(() => {
        wait().then(() => {
          assert.equal(reportStub.callCount, 3);
          assert.deepEqual(reportStub.getCall(0).args, ['start', expected], 'should have received proper attrs');
          assert.deepEqual(reportStub.getCall(1).args, ['pause', expected], 'should have received proper attrs');
          assert.deepEqual(reportStub.getCall(2).args, ['start', expected], 'should have received proper attrs');
          done();
        });
      });
    });
  });
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
    service.set('hifi', hifiStub);
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
  service.set('hifi', hifiStub);
  Ember.run(() => service.play(story.id));
});

test('with the bumper-state enabled, the bumper will act on a finished track event', function(assert) {
  let url = '/audio.mp3';
  let story = server.create('story', { audio: url });
  let audio = DummyConnection.create({ url });
  let done = assert.async();
  const service = this.subject({
    currentContext: 'home-page',
    _trackPlayerEvent() {},
    sendCompleteListenAction() {},
    playBumper() {
      assert.ok('playBumper is called');
      done();
    }
  });
  service.get('hifi.soundCache').cache(audio);
  service.set('bumperState.autoplayEnabled', true);

  Ember.run(() => {
    service.play(story.id).then(() => {
      audio.trigger('audio-ended');
    });
  });
  return wait();
});


// TODO: skip until we merge in stream mirage factories
// moduleFor('service:audio', 'Unit | Service | Audio Analytics', {
//   // Specify the other units that are required for this test.
//   needs: ['model:story','adapter:story','serializer:story',
//           'model:discover/stories',
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
