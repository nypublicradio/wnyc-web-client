import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import config from 'wqxr-web-client/config/environment';
import { next } from 'ember-runloop';

moduleForAcceptance('Acceptance | player events');

test('visiting /player-events', function(assert) {
  let story = server.create('story', {title: "Test audio", audio: '/good/150000/test'});
  let done = assert.async();
  server.create('stream');

  visit(`/story/${story.slug}/`);

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
  click('main [data-test-selector="listen-button"]');

  andThen(() => {
    // let hifi go a tick, otherwise we report the second play as a start, not a resume
    next(() => {
      // pause
      click('.nypr-player-button.mod-listen');

      // play
      click('.nypr-player-button.mod-listen');
    });
  });

  andThen(() => {
    // fast forward
    click('.nypr-player-button.mod-fastforward');

    // rewind
    click('.nypr-player-button.mod-rewind');

    // set position
    let progressMeter = find('.nypr-player-progress');
    let leftEdge = progressMeter.offset().left;
    var e = window.$.Event('mousedown', {which: 1, pageX: leftEdge + 200});
    progressMeter.trigger(e);
  });
});
