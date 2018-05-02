import { click, visit, triggerEvent, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import config from 'wqxr-web-client/config/environment';

import DummyConnection from 'ember-hifi/hifi-connections/dummy-connection';

const setupHifi = app => {
  const HIFI = app.lookup('service:hifi');
  app.register('hifi-connection:local-dummy-connection', DummyConnection, {instantiate: false});
  HIFI.set('_connections', [HIFI._activateConnection({name: 'LocalDummyConnection'})]);
}

module('Acceptance | player events', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /player-events', async function(assert) {
    setupHifi(this.owner);

    let story = server.create('story', {title: "Test audio", audio: '/good/150000/test'});
    let done = assert.async();
    server.create('stream');

    await visit(`/story/${story.slug}/`);

    let calls = [];
    server.post(`${config.platformEventsAPI}/v1/events/listened`, (schema, {requestBody}) => {
      calls.push(JSON.parse(requestBody).action);
      if (calls.length === 6) {
        assert.ok('6 calls');
        assert.deepEqual(calls.sort(), ['start', 'pause', 'resume', 'skip_15_forward', 'skip_15_back', 'set_position'].sort());
        done();
      }
    });

    // story header play button
    await click('main [data-test-selector="listen-button"]');

    // pause
    await click('.nypr-player-button.mod-listen');

    // play
    await click('.nypr-player-button.mod-listen');

    // fast forward
    await click('.nypr-player-button.mod-fastforward');

    // rewind
    await click('.nypr-player-button.mod-rewind');

    // set position
    let progressMeter = find('.nypr-player-progress');
    let leftEdge = progressMeter.getBoundingClientRect().left;
    triggerEvent('.nypr-player-progress', 'mousedown', {which: 1, pageX: leftEdge + 200})
  });
});
