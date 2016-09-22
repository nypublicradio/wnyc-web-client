import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';
import 'overhaul/tests/helpers/with-feature';
import get from 'ember-metal/get';

const mockMetrics = Ember.Service.extend({
  init() {
    this.trackedEvents = [];
  },
  trackEvent(event) {
    get(this, 'trackedEvents').pushObject(event);
  }
});

const discoverEvent = function(action, otherProperties) {
  return Object.assign({category: 'Discover', action}, otherProperties);
};

moduleForAcceptance('Acceptance | discover metrics',
  {
    beforeEach() {
      window.Modernizr.touch = false;
      let session = currentSession(this.application);
      let application = this.application;
      session.set('data.discover-excluded-shows',  []);
      session.set('data.discover-topics', []);
      session.set('data.discover-excluded-story-ids', []);

      application.register('service:mockMetrics', mockMetrics);
      application.inject('controller', 'metrics', 'service:mockMetrics');
      application.inject('route',      'metrics', 'service:mockMetrics');
      application.inject('component',  'metrics', 'service:mockMetrics');
      this.metrics = application.__container__.lookup('service:mockMetrics');
    }
  }
);

test(`it logs a 'Discover Entered' event when visiting the splash page`, function(assert) {
  withFeature('discover');
  visit('/discover/start');

  andThen(() => {
    assert.equal(this.metrics.get('trackedEvents').length, 1, 'it should log one event');
    assert.deepEqual(this.metrics.get('trackedEvents')[0], discoverEvent('Discover Entered'));
  });
});

test(`it logs a 'Clicked Get Started' when you click 'Get Started'`, function(assert) {
  withFeature('discover');
  visit('/discover/start');
  click('button:contains(Get Started)');
  andThen(() => {
    assert.equal(this.metrics.get('trackedEvents').length, 2, 'it should log two events');
    assert.deepEqual(this.metrics.get('trackedEvents')[1], discoverEvent('Clicked Get Started'), 'the second event should be clicked get started');
  });
});


