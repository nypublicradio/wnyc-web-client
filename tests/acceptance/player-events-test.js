import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import config from 'wnyc-web-client/config/environment';

moduleForAcceptance('Acceptance | player events');

test('visiting /player-events', function(assert) {
  let story = server.create('story', {title: "Test audio", audio: '/good/150000/test'});
  let id = `story/${story.slug}/`;
  let done = assert.async();
  server.create('stream');

  visit(`/story/${story.slug}/`);

  let calls = [];
  server.post(`${config.platformEventsAPI}/v1/events/listened`, (schema, {requestBody}) => {
    console.log(`action: ${JSON.parse(requestBody).action}`);
    calls.push(JSON.parse(requestBody).action);
    if (calls.length === 6) {
      assert.ok('6 calls');
      assert.deepEqual(calls.sort(), ['start', 'pause', 'resume', 'skip_15_forward', 'skip_15_back', 'set_position'].sort());
      done();
    }
  });

  // story header play button
  andThen(() => {
    click('article [data-test-selector="listen-button"]');
    // pause
    click('.nypr-player-button.mod-listen');
    // play
    click('.nypr-player-button.mod-listen');
    // fast forward
    click('.nypr-player-button.mod-fastforward');
    // rewind
    click('.nypr-player-button.mod-rewind');
  });

  andThen(() => {
    var e = window.$.Event('mousedown', {which: 1});
    find('.nypr-player-progress').trigger(e);
  });
});
