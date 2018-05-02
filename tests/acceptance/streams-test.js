import { click, findAll, currentURL, visit, waitFor } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

import DummyConnection from 'ember-hifi/hifi-connections/dummy-connection';

const setupHifi = app => {
  const HIFI = app.lookup('service:hifi');
  app.register('hifi-connection:local-dummy-connection', DummyConnection, {instantiate: false});
  HIFI.set('_connections', [HIFI._activateConnection({name: 'LocalDummyConnection'})]);
}

module('Acceptance | streams', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /streams', async function(assert) {
    let streams = server.createList('stream', 7);
    server.createList('whats-on', 7);

    let wqxrStreams = streams.filter(stream => stream.attrs.source_tags.includes('wqxr_site'));
    let wnycStreams = streams.filter(stream => stream.attrs.source_tags.includes('wnyc_site'));
    let allStreams = wqxrStreams.sort((a, b) => a.site_priority - b.site_priority)
      .concat(wnycStreams.sort((a, b) => a.site_priority - b.site_priority)).uniq();

    await visit('/streams');

    assert.equal(currentURL(), '/streams');
    assert.equal(findAll('.stream-list li').length, 7, 'should display a list of streams');
    assert.deepEqual(
      allStreams.map(stream => stream.attrs.name),
      findAll('.stream-list li .streamitem-header .streamitem-link').map(el => el.textContent.trim()),
      'should order by site and priority'
    );
  });

  test('playing a stream', async function(assert) {
    setupHifi(this.owner);
    server.createList('stream', 7);
    server.createList('whats-on', 7);

    await visit('/streams');

    await click('.stream-list li:first-child button');
    await waitFor('.nypr-player');

    assert.ok('persistent player should be visible');
  });

  test('stream routes do dfp targeting', async function() /*assert*/{
    server.createList('stream', 7);
    server.createList('whats-on', 7);

    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    await visit('/');

    this.mock(this.owner.lookup('route:stream').get('googleAds'))
      .expects('doTargeting')
      .once();

    await visit('/streams');
  });
});
