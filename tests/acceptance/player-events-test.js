import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import config from 'wqxr-web-client/config/environment';

moduleForAcceptance('Acceptance | player events');

test('visiting /player-events', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  let done = assert.async();

  server.create('django-page', {id, slug: story.slug});
  server.create('stream');

  djangoPage
    .bootstrap({id})
    .visit({id});

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
  andThen(() => {
    click('main [data-test-selector="listen-button"]');
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
    var e = $.Event('mousedown', {which: 1});
    find('.nypr-player-progress').trigger(e);
  });
});
