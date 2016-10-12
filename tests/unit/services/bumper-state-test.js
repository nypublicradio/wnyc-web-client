import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
const { A, Service } = Ember;
import 'overhaul/tests/helpers/with-feature';

const FeatureStub = Service.extend({
  isEnabled() {
    return true;
  }
});


moduleFor('service:bumper-state', 'Unit | Service | bumper state', {
  // Specify the other units that are required for this test.
  needs: [
    'service:audio',
    'service:listen-queue',
    'model:stream',
    'adapter:stream',
    'serializer:stream',
    'model:story',
    'adapter:story'
  ],

  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {
        'user-prefs-active-autoplay': 'default_stream',
        'user-prefs-active-stream': 'wnyc-fm939',
        'queue': {
          'items': A(),
        }
      }
    });

    startMirage(this.container);
    this.register('service:features', FeatureStub);
    this.register('service:session', sessionStub);
    this.inject.service('session');
    this.inject.service('features');
  },

  afterEach() {
    window.server.shutdown();
  }
});


// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});


test('calls a function that returns the queue bumper url and the bumper context previous context was on-demand', function(assert) {
  const [first, second] = server.createList('story', 2);
  const bumper = this.subject();
  const session = get(bumper, 'session');

  return wait().then(() => {
    set(session, 'data.queue', [Ember.Object.create(first), Ember.Object.create(second)]);
    set(session, 'data.user-prefs-active-autoplay', 'queue');

    const [expectedBumperURL, expectedBumperContext] = ['http://audio-bumper.com/thucyides.mp3', 'continuous-play-bumper'];
    const [actualBumperURL, actualBumperContext] = bumper.getNext('home-page');

    assert.equal(expectedBumperURL, actualBumperURL);
    assert.equal(expectedBumperContext, actualBumperContext);
  });
});

test('calls a function that returns the bumper stream information when the current context is on-demand', function(assert) {

  const bumper = this.subject();
  return wait().then(() => {
    const [expectedBumperURL, expectedBumperContext] = ['http://wnyc-fm939.mp3', 'continuous-play-bumper'];
    const [actualBumperURL, actualBumperContext] = bumper.getNext('home-page');

    assert.equal(expectedBumperURL, actualBumperURL);
    assert.equal(expectedBumperContext, actualBumperContext);
  });
});

test('calls a function that returns the bumper wqxr stream information when the current context is on-demand', function(assert) {
  const bumper = this.subject();
  set(bumper, 'session.data.user-prefs-active-stream', 'wqxr');
  return wait().then(() => {
    let [expectedBumperURL, expectedBumperContext] = ['http://wqxr.mp3', 'continuous-play-bumper'];
    let [actualBumperURL, actualBumperContext] = bumper.getNext('home-page');

    assert.equal(expectedBumperURL, actualBumperURL);
    assert.equal(expectedBumperContext, actualBumperContext);
  });
});

test('calls a function that returns the stream information when the current context is the bumper', function(assert) {
  const bumper = this.subject();

  return wait().then(() => {
    let [expectedAudioType, expectedStreamContext] = ['wnyc-fm939', 'stream'];
    let [actualAudioType, actualStreamContext] = bumper.getNext('continuous-play-bumper');

    assert.equal(expectedAudioType, actualAudioType);
    assert.equal(expectedStreamContext, actualStreamContext);
  });
});


test('if the queue is empty and the preference is set to what is in the queue, the bumper service will be disabled', function(assert) {
  const bumper = this.subject();
  const session = get(bumper, 'session');
  set(session, 'data.user-prefs-active-autoplay', 'queue');
  set(session, 'data.queue', []);
  return wait().then(() => {
    let actualState = get(bumper, 'isEnabled');
    assert.equal(actualState, false);
  });
});

test('if the queue has items, and the preference is set to what is in the queue, the bumper service will be enabled', function(assert) {
  let [first, second] = server.createList('story', 2);
  const bumper = this.subject();
  const { session, queue } = getProperties(bumper, 'session', 'queue');
  set(session, 'data.queue', A());
  set(session, 'data.user-prefs-active-autoplay', 'queue');

  Ember.run(() => {
    queue.addToQueueById(first.id);
    queue.addToQueueById(second.id);
  });

  return wait().then(() => {
    let actualState = get(bumper, 'isEnabled');
    assert.equal(actualState, true);
  });
});


test('if the queue is empty and the preference is set to "Do Not Autoplay", the bumper service be disabled', function(assert) {
  const bumper = this.subject();
  const session = get(bumper, 'session');
  session.set('data.user-prefs-active-autoplay', 'no_autoplay');
  return wait().then(() => {
    let actualState = get(bumper, 'isEnabled');
    assert.equal(actualState, false);
  });
});
