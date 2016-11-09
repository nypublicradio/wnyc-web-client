import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
const { A, Service } = Ember;
import 'overhaul/tests/helpers/with-feature';
import { mockExperimentalGroup } from 'overhaul/tests/helpers/mock-experimental-group';

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
    mockExperimentalGroup(1);
    const FeatureStub = Service.extend({
      isEnabled() {
        return true;
      }
    });

    const sessionStub = Ember.Service.extend({
      data: {
        'user-prefs-active-autoplay': 'default_stream',
        'user-prefs-active-stream': {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
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


test('getBumperUrl returns the queue bumper url for the queue when pref is set to queue', function(assert) {
  const [first, second] = server.createList('story', 2);
  const bumper = this.subject();

  return wait().then(() => {
    set(bumper, 'session.data.queue', [Ember.Object.create(first), Ember.Object.create(second)]);
    set(bumper, 'session.data.user-prefs-active-autoplay', 'queue');

    const expectedBumperURL = 'http://audio-bumper.com/thucyides.mp3';
    const actualBumperURL = bumper.getBumperUrl();

    assert.equal(expectedBumperURL, actualBumperURL);
  });
});

test('getBumperUrl returns the bumper url when the pref is set to default_stream', function(assert) {
  const wnycStream = server.create('stream', {slug: 'wnyc-fm939'});
  const bumper = this.subject();

  return wait().then(() => {
    const expectedBumperURL = wnycStream.audio_bumper;
    const actualBumperURL = bumper.getBumperUrl();
    assert.equal(expectedBumperURL, actualBumperURL);
  });
});

test('getBumperUrl returns the wqxr bumper url when the prefs are set to default_stream and wqxr', function(assert) {
  const wqxrStream = server.create('stream', {slug: 'wqxr'});
  const bumper = this.subject();
  set(bumper, 'session.data.user-prefs-active-stream', {slug: 'wqxr', name: 'WQXR New York'});

  return wait().then(() => {
    const expectedBumperURL = wqxrStream.audio_bumper;
    const actualBumperURL = bumper.getBumperUrl();
    assert.equal(expectedBumperURL, actualBumperURL);
  });
});

test('getAutoplayAudioId the default stream slug when pref is default_stream', function(assert) {
  const wnycStream = server.create('stream', {slug: 'wnyc-fm939'});
  const bumper = this.subject();

  return wait().then(() => {
    const expectedAudio = 'wnyc-fm939';
    const actualAudio = bumper.getAutoplayAudioId();
    assert.equal(expectedAudio, actualAudio);
  });
});


test('if the queue is empty and the preference is set to queue, the bumper service will be disabled', function(assert) {
  const bumper = this.subject();
  set(bumper, 'session.data.user-prefs-active-autoplay', 'queue');
  set(bumper, 'session.data.queue', []);
  return wait().then(() => {
    let actualState = get(bumper, 'autoplayEnabled');
    assert.equal(actualState, false);
  });
});

test('if the queue has items, and the preference is set to queue, the bumper service will be enabled', function(assert) {
  let [first, second] = server.createList('story', 2);
  const bumper = this.subject();
  const queue = get(bumper, 'queue');
  set(bumper, 'session.data.queue', A());
  set(bumper, 'session.data.user-prefs-active-autoplay', 'queue');

  Ember.run(() => {
    queue.addToQueueById(first.id);
    queue.addToQueueById(second.id);
  });

  return wait().then(() => {
    let actualState = get(bumper, 'autoplayEnabled');
    assert.equal(actualState, true);
  });
});

test('if the queue is empty and the preference is set to no_autoplay, the bumper service be disabled', function(assert) {
  const bumper = this.subject();
  const session = get(bumper, 'session');
  session.set('data.user-prefs-active-autoplay', 'no_autoplay');
  return wait().then(() => {
    let actualState = get(bumper, 'autoplayEnabled');
    assert.equal(actualState, false);
  });
});
