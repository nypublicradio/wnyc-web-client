import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { currentSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';
import { registerAndInjectMock, registerMockOnInstance } from 'wnyc-web-client/tests/helpers/register-mock';
import 'wnyc-web-client/tests/helpers/with-feature';
import get from 'ember-metal/get';
import velocity from 'velocity';

const mockMetrics = Ember.Service.extend({
  init() {
    this.trackedEvents = [];
  },
  trackEvent(event) {
    if (event && event.category === 'Discover') {
      get(this, 'trackedEvents').pushObject(event);
    }
  },
  trackPage() {},
  identify() {},
  activateAdapters() {},
  invoke() {}
});

const discoverEvent = function(action, otherProperties={}) {
  return Object.assign({category: 'Discover', action}, otherProperties);
};

moduleForAcceptance('Acceptance | discover metrics',
  {
    beforeEach() {
      velocity.mock = true;
      window.Modernizr.touchevents = false;
      let application = this.application;
      let session = currentSession(application);
      session.set('data.discover-excluded-shows',  []);
      session.set('data.discover-topics', []);
      session.set('data.discover-excluded-story-ids', []);
      server.create('discover-topic', {title: "Test Topic", url: "test-topic"});
      server.create('discover-topic', {title: "Example Topic", url: "example-topic"});
      server.createList('discover-story', 2);
      this.shows = server.createList('show', 2);
      this.metrics = registerAndInjectMock(application, 'service:mockMetrics', mockMetrics, 'metrics');
      server.create('stream');
    },
    afterEach() {
        velocity.mock = false;
    }
  }
);

test('it should log the correct events during onboarding', function(assert) {
  withFeature('discover');

  visit('/discover/start');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Discover Entered'),
      'it should log a discover entered event when visiting the splash page');
  });

  click('button:contains(Get Started)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Get Started'),
      'it should log a clicked get started event when you click get started');
  });


  // Test Topic Events in Onboarding
  click('.discover-topic:contains(Test Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Topic', {label: 'Test Topic'}),
      'it should log a selected topic event when you click a topic');
  });

  click('button:contains(Select All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected All Topics'),
      'it should log a selected all topics event when click select all');
  });

  click('button:contains(Clear All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Cleared All Topics'),
      'it should log a cleared all topics event when click clear all');
  });

  click('.discover-topic:contains(Example Topic)');
  click('.discover-topic.is-selected:contains(Example Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Topic', {label: 'Example Topic'}),
      'it should log a deselected topic event when you click a selected topic');
  });


  click('.discover-topic:contains(Test Topic)');
  click('button:contains(Next)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Next in Discover'),
      'it should log a clicked next event when you click next');
  });


  // Test Show Events in Onboarding
  click(`.discover-show.is-selected:contains(${this.shows[0].title})`);
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Show in Discover', {label: this.shows[0].title}),
      'it should log a deselected show event when you click a selected show');
  });

  click(`.discover-show:contains(${this.shows[0].title})`);
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Show in Discover', {label: this.shows[0].title}),
      'it should log a selected show event when you click a show');
  });


  click('button:contains(Back)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Back in Discover'),
      'it should log a clicked back event when you click back from shows');
  });

  click('button:contains(Back)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents').slice(-2)[0],
      discoverEvent('Clicked Back in Discover'),
      'it should log a clicked back event when you click back from topics');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Discover Entered'),
      'it even logs a discover entered event when visiting the splash while going back');
  });

  click('button:contains(Get Started)');
  click('button:contains(Next)');
  click('button:contains(Create Playlist)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Create Playlist in Discover'),
      'it should log a create playlist event when you click create playlist');
  });
});

test('it should not log a "discover entered" event when redirected past the splash page', function(assert) {
  server.create('django-page', {id: '/'});
  withFeature('discover');
  visit('/discover/start'); // discover event 1
  click('button:contains(Get Started)'); // discover event 2
  visit('/');
  click('a:contains(Discover)'); // no discover event
  andThen(() => {
    assert.strictEqual(this.metrics.get('trackedEvents').length,
      2,
      'it should not log an extra "discover entered" event');
  });
});

moduleForAcceptance('Acceptance | discover metrics returning user',
  {
    beforeEach() {
      velocity.mock = true;
      window.Modernizr.touchevents = false;
      let application = this.application;
      let session = currentSession(application);
      server.create('discover-topic', {title: "Test Topic", url: "test-topic"});
      server.create('discover-topic', {title: "Example Topic", url: "example-topic"});
      server.create('discover-topic', {title: "Third Topic", url: "third-topic"});
      this.stories = server.createList('discover-story', 10);
      this.shows = server.createList('show', 10);
      session.set('data.discover-excluded-shows',  [this.shows[1].slug]); // set some excluded shows
      session.set('data.discover-topics', ['example-topic']); // set some saved topics
      session.set('data.discover-excluded-story-ids', []);
      session.set('data.discover-queue',  server.db.discoverStories); // set some saved stories
      // register mock directly on the instance to fool the link handler
      this.metrics = registerMockOnInstance(application, 'service:metrics', mockMetrics);
      server.create('stream');
    },
    afterEach() {
      velocity.mock = false;
    }
  }
);

test('it should log the correct events when starting with a playlist', function(assert) {
  withFeature('discover');
  visit('/discover/playlist');

  click('a:contains(Summary)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Expanded Summary', {value: Number(this.stories[0].id) }),
      'it should log an expanded summary event when you click summary');
  });

  click('a:contains(Summary)');
  andThen(() => {
    assert.strictEqual(this.metrics.get('trackedEvents').length,
      1,
      'it should not log a second expanded summary event when you click summary to close it');
  });

  drag('mouse',
    `.discover-playlist-item-handle[data-story-id=${this.stories[0].id}]`,
    function() {return {dy: -200, dx:0};}
  );
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Moved Story', {value: Number(this.stories[0].id) }),
      'it should log a moved event when you reorder the playlist');
  });

  click(`.discover-playlist-item-delete[data-story-id=${this.stories[1].id}]`);
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Removed Story from Discover', {value: Number(this.stories[1].id) }),
      'it should log a removed event when you click the remove button');
  });

  click('button:contains(Refresh Playlist)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Find More in Discover'),
      'it should log a clicked find more event when you click refresh playlist');
  });

  click('a:contains(Edit My Shows & Topics)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Edit in Discover'),
      'it should log a clicked edit event when you click edit');
  });


  // Test Topic Events while Editing
  click('a:contains(Pick Topics)');
  click('.discover-topic:contains(Test Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Topic', {label: 'Test Topic'}),
      'it should log a selected topic event when you click a topic');
  });

  click('button:contains(Select All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected All Topics'),
      'it should log a selected all topics event when click select all');
  });

  click('button:contains(Clear All)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Cleared All Topics'),
      'it should log a cleared all topics event when click clear all');
  });

  click('.discover-topic:contains(Example Topic)');
  click('.discover-topic.is-selected:contains(Example Topic)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Topic', {label: 'Example Topic'}),
      'it should log a deselected topic event when you click a selected topic');
  });


  // Test Show Events while Editing
  click('.discover-topic:contains(Test Topic)');
  click('a:contains(Pick Shows)');
  click(`.discover-show.is-selected:contains(${this.shows[0].title})`);
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Show in Discover', {label: this.shows[0].title}),
      'it should log a deselected show event when you click a selected show');
  });

  click(`.discover-show:contains(${this.shows[0].title})`);
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Show in Discover', {label: this.shows[0].title}),
      'it should log a selected show event when you click a show');
  });


  click('button:contains(Refresh Playlist)');
  andThen(() => {
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Create Playlist in Discover', {label: 'Refresh Playlist'}),
      'it should log a create playlist event with a refresh label when you click refresh');
  });
});

test('it shouldn\'t log a clicked edit event when visiting /discover/edit directly', function(assert) {
  withFeature('discover');
  visit('/discover/edit');
  andThen(() => {
    assert.strictEqual(this.metrics.get('trackedEvents').length, 0);
  });
});
