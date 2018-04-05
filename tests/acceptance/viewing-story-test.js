import { findAll, currentURL, find, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import storyPage from 'wnyc-web-client/tests/pages/story';
import config from 'wnyc-web-client/config/environment';

import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | Story Detail', function(hooks) {
  setupApplicationTest(hooks);

  test('smoke test', async function(assert) {
    let story = server.create('story');
    await visit(`story/${story.slug}`);

    assert.equal(currentURL(), `story/${story.slug}`);
    assert.ok(find('#storyHeader'), 'story header should load');
    assert.ok(find('.sitechrome-btn'), 'donate button should be the default');
  });

  test('smoke test news story without show title', async function(assert) {
    let story = server.create('story', {showTitle: undefined});
    await visit(`story/${story.slug}`);

    assert.equal(currentURL(), `story/${story.slug}`);
    assert.ok(find('#storyHeader'), 'story header should load');
    assert.ok(find('.sitechrome-btn'), 'donate button should be the default');
  });

  test('view comments as regular user', async function(assert) {
    let story = server.create('story', {enableComments: true});
    await visit(`story/${story.slug}`);

    storyPage.clickShowComments();

    assert.ok(storyPage.commentsVisible, 'comments are visible');
    assert.notOk(findAll('.js-feature-comment').length, 'feature controls are visible');
  });

  test('view comments as staff user', async function(assert) {
    server.get(`${config.adminRoot}/api/v1/is_logged_in/`, {is_staff: true});
    server.create('user');

    let story = server.create('story', {enableComments: true});
    server.createList('comment', 5, {story});
    await visit(`story/${story.slug}`);

    storyPage.clickShowComments();
    assert.ok(findAll('[data-test-selector=moderate]').length, 'moderate control is visible');
  });

  test('story pages with a play param', async function(assert) {
    let story = server.create('story');
    await visit(`story/${story.slug}/?play=${story.slug}`);

    assert.equal(currentURL(), `story/${story.slug}/?play=${story.slug}`);
    assert.ok(findAll('.nypr-player').length, 'persistent player should be visible');
    assert.equal(find('[data-test-selector=nypr-player-story-title]').textContent, story.title, `${story.title} should be loaded in player UI`);
  });
});

module('Acceptance | Story Donate URLs', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting a story with a different donate URL', async function(assert) {
    let donateStory = server.create('story', {
      headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
    });
    await visit(`story/${donateStory.slug}`);


    assert.equal(find('.foo').textContent, 'donate to foo', 'donate chunk should match');
  });
});

module('Acceptance |  Story Detail Analytics', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    delete window.ga;
  });

  test('metrics properly reports story attrs', async function(assert) {
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
        client: 'wnyc_web',
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

    await visit(`story/${story.slug}`);

  });

  test('story routes do dfp targeting', async function() /*assert*/{
    let forDfp = {tags: ['foo', 'bar'], show: 'foo show', channel: 'foo channel', series: ['foo series']};
    let story = server.create('story', forDfp);

    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'foo/'});
    await visit('/foo');
    this.mock(this.application.__container__.lookup('route:story').get('googleAds'))
      .expects('doTargeting')
      .once()
      .withArgs(forDfp);

    await visit(`story/${story.slug}`);
  });

  test('listen button on story page includes data-story and data-show values', async function(assert) {
    let story = server.create('story', {showTitle: 'foo show'});
    let segmentStory = server.create('story', 'withSegments', {showTitle: 'foo show'});

    await visit(`story/${story.slug}`);

    let listenButton = findWithAssert('#storyHeader [data-test-selector=listen-button]');
    assert.equal(listenButton.attr('data-show'), 'foo show');
    assert.equal(listenButton.attr('data-story'), story.title);

    await visit(`story/${segmentStory.slug}`);
    let segmentButtons = findWithAssert('#segmentsList [data-test-selector=listen-button]');
    segmentButtons.each((i, el) => {
      assert.equal($(el).attr('data-show'), 'foo show');
      assert.equal($(el).attr('data-story'), segmentStory.segments[i].title);
    });
  });

  test('api request includes draft params', async function(assert) {
    assert.expect(4);

    let story = server.create('story');
    let token = 'token';
    let content_type_id = 'type';
    let object_id = 'object';
    let stamp = 'timestamp';

    server.get(`${config.publisherAPI}/v3/story/${story.slug}`, (schema, { queryParams }) => {
      assert.equal(queryParams.token, token);
      assert.equal(queryParams.content_type_id, content_type_id);
      assert.equal(queryParams.object_id, object_id);
      assert.equal(queryParams['_'], stamp);
      return story;
    });

    await visit(
      `story/${story.slug}?token=${token}&content_type_id=${content_type_id}&object_id=${object_id}&_=${stamp}`
    );

  });
});
