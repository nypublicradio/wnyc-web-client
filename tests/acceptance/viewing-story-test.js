import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import storyPage from 'wqxr-web-client/tests/pages/story';
import config from 'wqxr-web-client/config/environment';


moduleForAcceptance('Acceptance | Django Page | Story Detail');

test('smoke test', function(assert) {
  let story = server.create('story');
  visit(`/story/${story.id}/`);

  andThen(() => {
    assert.equal(currentURL(), `/story/${story.id}/`);
    assert.ok(find('.sitechrome-btn'), 'donate button should be the default');
  });
});

test('view comments as regular user', function(assert) {
  let story = server.create('story');
  visit(`/story/${story.id}/`);

  storyPage.clickShowComments();

  andThen(() => {
    assert.ok(storyPage.commentsVisible, 'comments are visible');
    assert.notOk(find('.js-feature-comment').length, 'feature controls are visible');
  });
});

test('view comments as staff user', function(assert) {
  server.get(`${config.wnycAdminRoot}/api/v1/is_logged_in/`, {is_staff: true});
  server.create('user');
  
  let story = server.create('story');
  server.createList('comment', 5, {story});
  visit(`/story/${story.id}/`);

  storyPage.clickShowComments();
  andThen(() =>
    assert.ok(find('[data-test-selector=moderate]').length, 'moderate control is visible'));
});

test('story pages with a play param', function(assert) {

  let story = server.create('story');
  visit(`/story/${story.id}/?play=${story.id}`);

  andThen(function() {
    assert.equal(currentURL(), `story/${story.slug}/?play=${story.id}`);
    assert.ok(find('.nypr-player').length, 'persistent player should be visible');
    assert.equal(find('[data-test-selector=nypr-player-story-title]').text(), story.title, `${story.title} should be loaded in player UI`);
  });
});

moduleForAcceptance('Acceptance | Django Page | Story Donate URLs');

test('visiting a story with a different donate URL', function(assert) {
  let donateStory = server.create('story', {
    extendedStory: {
      headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
    }
  });
  visit(`story/${donateStory.id}/`);


  andThen(function() {
    assert.equal(find('.foo').text(), 'donate to foo', 'donate chunk should match');
  });
});

moduleForAcceptance('Acceptance | Django Page | Story Detail Analytics', {
  afterEach() {
    delete window.ga;
  }
});

test('metrics properly reports story attrs', function(assert) {
  let story = server.create('story');

  assert.expect(2);

  server.post(`${config.platformEventsAPI}/v1/events/viewed`, (schema, {requestBody}) => {
    let {
      cms_id,
      item_type,
      browser_id,
      client,
      referrer,
      url,
      site_id
    } = JSON.parse(requestBody);
    let testObj = {
      cms_id: story.id,
      item_type: 'story',
      browser_id: undefined,
      client: 'wqxr_web',
      referrer: location.toString(),
      url: location.toString(),
      site_id: config.siteId
    };
    assert.deepEqual({cms_id, item_type, browser_id, client, referrer, url, site_id}, testObj, 'params match up');
  });

  window.ga = function(command) {
    if (command === 'npr.send') {
      assert.ok('called npr.send');
    }
  };

  visit(`/story/${story.id}/`);

});

test('story routes do dfp targeting', function(/*assert*/) {
  let forDfp = {tags: ['foo', 'bar'], show: 'foo show', channel: 'foo channel', series: 'foo series'};
  let story = server.create('story', {extendedStory: forDfp});

  
  // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
  visit('/');

  andThen(() => {
    this.mock(this.application.__container__.lookup('route:story').get('googleAds'))
      .expects('doTargeting')
      .once()
      .withArgs(forDfp);
  });
  
  visit(`/story/${story.id}/`);
});
