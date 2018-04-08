import Service from '@ember/service';
import { click, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession } from 'ember-simple-auth/test-support';
import {
  registerAndInjectMock,
  registerMockOnInstance
} from 'wnyc-web-client/tests/helpers/register-mock';
import { get } from '@ember/object';
import velocity from 'velocity';

const mockMetrics = Service.extend({
  init() {
    this._super(...arguments);
    this.trackedEvents = [];
  },
  trackEvent(service, event) {
    let isGA = service && service === 'GoogleAnalytics';
    let isDiscover = event && event.category === 'Discover';
    if (isGA && isDiscover) {
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

module('Acceptance | discover metrics', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    velocity.mock = true;
    window.Modernizr.touchevents = false;
    let session = currentSession();
    session.set('data.discover-excluded-shows',  []);
    session.set('data.discover-topics', []);
    session.set('data.discover-excluded-story-ids', []);
    server.create('discover-topic', {title: "Test Topic", url: "test-topic"});
    server.create('discover-topic', {title: "Example Topic", url: "example-topic"});
    server.createList('discover-story', 2);
    this.shows = server.createList('show', 2);
    this.metrics = registerAndInjectMock(this.owner, 'service:mockMetrics', mockMetrics, 'metrics');
    server.create('stream');
  });

  hooks.afterEach(function() {
      velocity.mock = false;
  });

  skip('it should log the correct events during onboarding', async function(assert) {
    await visit('/discover/start');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Discover Entered'),
      'it should log a discover entered event when visiting the splash page');

    await click('button.discover-welcome-screen-button');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Get Started'),
      'it should log a clicked get started event when you click get started');


    // Test Topic Events in Onboarding
    await click('.discover-topic');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Topic', {label: 'Test Topic'}),
      'it should log a selected topic event when you click a topic');

    await click('button.discover-topic-bubble');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected All Topics'),
      'it should log a selected all topics event when click select all');

    await click('button.discover-topic-bubble');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Cleared All Topics'),
      'it should log a cleared all topics event when click clear all');

    await click('.discover-topic:nth-of-type(2)');
    await click('.discover-topic.is-selected');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Topic', {label: 'Example Topic'}),
      'it should log a deselected topic event when you click a selected topic');


    await click('.discover-topic');
    await click('button.mod-filled-red');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Next in Discover'),
      'it should log a clicked next event when you click next');


    // Test Show Events in Onboarding
    await click(`.discover-show.is-selected`);
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Show in Discover', {label: this.shows[0].title}),
      'it should log a deselected show event when you click a selected show');

    await click(`.discover-show`);
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Show in Discover', {label: this.shows[0].title}),
      'it should log a selected show event when you click a show');


    await click('button.mod-with-icon');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Back in Discover'),
      'it should log a clicked back event when you click back from shows');

    await click('button.mod-with-icon');
    assert.deepEqual(this.metrics.get('trackedEvents').slice(-2)[0],
      discoverEvent('Clicked Back in Discover'),
      'it should log a clicked back event when you click back from topics');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Discover Entered'),
      'it even logs a discover entered event when visiting the splash while going back');

    await click('button.discover-welcome-screen-button');
    await click('button.mod-filled-red');
    await click('.discover-setup-header-action:last-child button');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Create Playlist in Discover'),
      'it should log a create playlist event when you click create playlist');
  });

  skip('it should not log a "discover entered" event when redirected past the splash page', async function(assert) {
    server.create('django-page', {id: '/'});
    await visit('/discover/start'); // discover event 1
    await click('button.discover-welcome-screen-button'); // discover event 2
    await visit('/');
    await click('a[href="/discover/start"]'); // no discover event
    assert.strictEqual(this.metrics.get('trackedEvents').length,
      2,
      'it should not log an extra "discover entered" event');
  });
});

module('Acceptance | discover metrics returning user', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    velocity.mock = true;
    window.Modernizr.touchevents = false;
    let session = currentSession();
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
    this.metrics = registerMockOnInstance(this.owner, 'service:metrics', mockMetrics);
    server.create('stream');
  });

  hooks.afterEach(function() {
    velocity.mock = false;
  });

  skip('it should log the correct events when starting with a playlist', async function(assert) {
    await visit('/discover/playlist');

    await click('a.discover-playlist-story-summary-action-link');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Expanded Summary', {value: Number(this.stories[0].id) }),
      'it should log an expanded summary event when you click summary');

    await click('a.discover-playlist-story-summary-action-link');
    assert.strictEqual(this.metrics.get('trackedEvents').length,
      1,
      'it should not log a second expanded summary event when you click summary to close it');

    // acceptance test helpers aren't working
    // await drag('mouse',
    //   `.discover-playlist-item-handle[data-story-id=${this.stories[0].id}]`,
    //   function() {return {dy: -200, dx:0};}
    // );
    // assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
    //   discoverEvent('Moved Story', {value: Number(this.stories[0].id) }),
    //   'it should log a moved event when you reorder the playlist');

    await click(`.discover-playlist-item-delete[data-story-id="${this.stories[1].id}"]`);
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Removed Story from Discover', {value: Number(this.stories[1].id) }),
      'it should log a removed event when you click the remove button');

    await click('button.discover-refresh-bar');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Find More in Discover'),
      'it should log a clicked find more event when you click refresh playlist');

    await click('a.discover-edit-playlist-link');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Clicked Edit in Discover'),
      'it should log a clicked edit event when you click edit');


    // Test Topic Events while Editing
    await click('a.discover-setup-tab-link-topics');
    await click('.discover-topic');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Topic', {label: 'Test Topic'}),
      'it should log a selected topic event when you click a topic');

    await click('button.discover-topic-bubble');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected All Topics'),
      'it should log a selected all topics event when click select all');

    await click('button.discover-topic-bubble');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Cleared All Topics'),
      'it should log a cleared all topics event when click clear all');

    await click('.discover-topic:nth-of-type(2)');
    await click('.discover-topic.is-selected');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Topic', {label: 'Example Topic'}),
      'it should log a deselected topic event when you click a selected topic');


    // Test Show Events while Editing
    await click('.discover-topic');
    await click('a.discover-setup-tab-link-shows');
    await click(`.discover-show.is-selected`);
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Deselected Show in Discover', {label: this.shows[0].title}),
      'it should log a deselected show event when you click a selected show');

    await click(`.discover-show`);
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Selected Show in Discover', {label: this.shows[0].title}),
      'it should log a selected show event when you click a show');


    await click('.discover-setup-header-action:last-child button');
    assert.deepEqual(this.metrics.get('trackedEvents.lastObject'),
      discoverEvent('Create Playlist in Discover', {label: 'Refresh Playlist'}),
      'it should log a create playlist event with a refresh label when you click refresh');
  });

  skip('it shouldn\'t log a clicked edit event when visiting /discover/edit directly', async function(assert) {
    await visit('/discover/edit');
    assert.strictEqual(this.metrics.get('trackedEvents').length, 0);
  });
});
