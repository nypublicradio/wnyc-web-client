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
    if (event && event.category === 'Discover') {
      get(this, 'trackedEvents').pushObject(event);
    }
  }
});

const discoverEvent = function(action, otherProperties={}) {
  return Object.assign({category: 'Discover', action}, otherProperties);
};

moduleForAcceptance('Acceptance | discover metrics',
  {
    beforeEach() {
      Ember.$.Velocity.mock = true;
      window.Modernizr.touch = false;
      let session = currentSession(this.application);
      let application = this.application;
      session.set('data.discover-excluded-shows',  []);
      session.set('data.discover-topics', []);
      session.set('data.discover-excluded-story-ids', []);
      server.create('discover-topic', {title: "Test Topic", url: "test-topic"});
      server.create('discover-topic', {title: "Example Topic", url: "example-topic"});
      server.createList('discover-story', 2);
      server.createList('show', 2);
      application.register('service:mockMetrics', mockMetrics);
      application.inject('controller', 'metrics', 'service:mockMetrics');
      application.inject('route',      'metrics', 'service:mockMetrics');
      application.inject('component',  'metrics', 'service:mockMetrics');
      this.metrics = application.__container__.lookup('service:mockMetrics');
    }
  }
);

test(`it should log the correct events`, function(assert) {
  withFeature('discover');

  visit('/discover/start');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Discover Entered'),
      `it should log a discover entered event when visiting the splash page`);
  });

  click('button:contains(Get Started)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Get Started'),
      `it should log a clicked get started event when you click get started`);
  });

  click('.discover-topic:contains(Test Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Topic', {label: 'Test Topic'}),
      `it should log a selected topic event when you click a topic`);
  });

  click('a:contains(Select All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected All Topics'),
      `it should log a selected all topics event when click select all`);
  });

  click('a:contains(Clear All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Cleared All Topics'),
      `it should log a cleared all topics event when click clear all`);
  });

  click('.discover-topic:contains(Example Topic)');
  click('.discover-topic:contains(Example Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Topic', {label: 'Example Topic'}),
      `it should log a deselected topic event when you click a selected topic`);
  });

  click('.discover-topic:contains(Test Topic)');
  click('button:contains(Next)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Next in Discover'),
      `it should log a clicked next event when you click next`);
  });

  click('button:contains(Create Playlist)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Create Playlist in Discover'),
      `it should log a create playlist event when you click create playlist`);
  });
});

