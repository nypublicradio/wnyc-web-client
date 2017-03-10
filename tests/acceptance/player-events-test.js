import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';
import config from 'wnyc-web-client/config/environment';

moduleForAcceptance('Acceptance | player events');

test('visiting /player-events', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});
  server.create('stream');

  djangoPage
    .bootstrap({id})
    .visit({id});

  let expected = {
    audio_type: 'on_demand',
    browser_id: 'secrets',
    client: 'wnyc_web',
    cms_id: 1,
    current_audio_position: 0,
    delta: 0,
    external_referrer: document.referrer,
    item_type: 'story',
    referrer: null,
    site_id: config.siteId,
    url: location.toString()
  };
  server.post(`${config.wnycAPI}/analytics/v1/listened`, (schema, {requestBody}) => {
    
  });
  
  andThen(() => click('[data-test-selector="listen-button"]'));
  andThen(() => {
    assert.ok(find('.nypr-player'));
  });
});
