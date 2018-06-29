import {
  click,
  findAll,
  currentURL,
  find,
  visit,
} from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import showPage from 'wnyc-web-client/tests/pages/show';
import config from 'wnyc-web-client/config/environment';
import moment from 'moment';

import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

import DummyConnection from 'ember-hifi/hifi-connections/dummy-connection';

const setupHifi = app => {
  const HIFI = app.lookup('service:hifi');
  app.register('hifi-connection:local-dummy-connection', DummyConnection, {instantiate: false});
  HIFI.set('_connections', [HIFI._activateConnection({name: 'LocalDummyConnection'})]);
}


module('Acceptance | Listing Page | viewing', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');

    window.assign = function() {}
  });

  test('smoke test', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'}
      ],
      socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
      apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
    });

    await visit('shows/foo');

    assert.equal(currentURL(), 'shows/foo');
    assert.ok(find('.sitechrome-btn'), 'donate chunk should reset after navigating');
    assert.ok(showPage.facebookIsVisible);
    assert.notOk(find('[data-test-selector="admin-link"]'), 'edit link should not be visible');
  });

  test('authenticated smoke test', async function(assert) {
    server.get(`${config.adminRoot}/api/v1/is_logged_in/`, {is_staff: true});
    server.create('user');
    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'}
      ],
      socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
      apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
    });

    await visit('shows/foo');

    assert.ok(find('[data-test-selector="admin-link"]'), 'edit links are visible');
  });

  test('about smoke test', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'about', title: 'About'},
      ],
      about: {
        body: 'About'
      },
      apiResponse: server.create('api-response', { id: 'shows/foo/about' })
    });

    await visit('shows/foo');

    assert.equal(showPage.aboutText, 'About');
  });

  test('visiting a listing page - story page smoke test', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/story/1',
      type: 'story',
      story: server.create('story')
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'story', title: 'Story'}
      ],
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(showPage.storyText, 'Story body.');
  });

  test('scripts in well route content will execute', async function(assert) {
    let story = server.create('story', {
      slug: 'foo',
      body: `test body.
  <script type="text/deferred-javascript">
  (function(){

    var p = document.createElement("p");
    p.innerHTML = "Added this paragraph!";
    document.querySelector("[data-test-selector=story-detail] .django-content").appendChild(p);

  })();
  \\x3C/script>
  `
    });

    let apiResponse = server.create('api-response', {
      id: 'shows/foo/story/1',
      type: 'story',
      story
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'story', title: 'Story'}
      ],
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(findAll('[data-test-selector=story-detail] p').length, 1, 'should only be one p tag');
    let nodes = find('[data-test-selector=story-detail] .django-content').querySelectorAll('p, div');
    let text = Array.from(nodes).map(e => e.innerText).join(' ');
    assert.equal(text, 'test body. Added this paragraph!');
  });

  test('using a nav-link', async function(assert) {
    server.create('api-response', {
      id: 'shows/foo/next-link/1',
      teaseList: server.createList('story', 1, {title: 'Story Title'})
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
        {'nav-slug': 'next-link', title: 'Next Link'}
      ],
      apiResponse: server.create('api-response', {
        id: 'shows/foo/episodes/1',
        teaseList: server.createList('story', 10, {title: 'Story Title'})
      })
    });

    await visit('shows/foo');

    await showPage.clickNavLink('Next Link');

    assert.deepEqual(showPage.storyTitles, ["Story Title"]);
  });

  test('visiting directly to a nav link url', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/episodes/1',
      teaseList: server.createList('story', 10)
    });
    server.create('api-response', {
      id: 'shows/foo/next-link/1',
      teaseList: server.createList('story', 1, {title: 'Story Title'})
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
        {'nav-slug': 'next-link', title: 'Next Link'}
      ],
      apiResponse
    });

    await visit('shows/foo/next-link');

    assert.equal(currentURL(), 'shows/foo/next-link');

    assert.equal(find('nav li.is-active > a').textContent.trim(), 'Next Link');
  });

  test('null social links should not break page', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/recent_stories/1',
      teaseList: server.createList('story', 10)
    });
    server.create('listing-page', {
      id: 'shows/foo',
      socialLinks: null,
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(currentURL(), 'shows/foo');
  });

  test('undefined social links should not break page', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/recent_stories/1',
      teaseList: server.createList('story', 10)
    });
    server.create('listing-page', {
      id: 'shows/foo',
      socialLinks: undefined,
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(currentURL(), 'shows/foo');
  });

  test('visiting a show with a different header donate chunk', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo',
      headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
      apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
    });
    server.create('django-page', {id: '/'});

    await visit('shows/foo')

    assert.equal(find('.foo').textContent.trim(), 'donate to foo', 'donate chunk should match');

    await click('a[href="/"]');

    assert.ok(find('.sitechrome-btn'), 'donate chunk should reset after navigating');
  });

  test('show pages with a play param', async function(assert) {
    setupHifi(this.owner);

    let story = server.create('story');
    server.create('listing-page', {
      id: 'shows/foo',
      apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
    });

    await visit(`shows/foo?play=${story.slug}`);

    assert.equal(currentURL(), `shows/foo?play=${story.slug}`);
    assert.ok(find('.nypr-player'), 'persistent player should be visible');
    assert.equal(find('[data-test-selector=nypr-player-story-title]').textContent, story.title, `${story.title} should be loaded in player UI`);
  });

  test('show pages with a listen live chunk', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo'
    });
    server.create('api-response', { id: 'shows/foo/recent_stories/1' });

    server.create('chunk', {
      id: 'shows-foo-listenlive',
      slug: 'shows-foo-listenlive',
      content: 'foo bar text'
    });

    await visit('shows/foo');

    assert.equal(find('.channel-header .django-content').textContent.trim(), 'foo bar text');
  });

  test('channel routes do dfp targeting', async function() /*assert*/{
    server.create('listing-page', {
      id: 'shows/foo'
    });
    server.create('api-response', { id: 'shows/foo/recent_stories/1' });

    this.mock(this.owner.lookup('route:show').get('googleAds'))
      .expects('doTargeting')
      .once();

    await visit('shows/foo');
  });

  test('if a show is airing, the featured story listen button says "Listen Live"', async function(assert) {
    let now = moment();
    let later = now.add(1, 'hour');
    let featuredStory = server.create('story', {
      isLatest: true,
      newsdate: now.toDate()
    });
    let featured = {};
    Object.keys(featuredStory.attrs).forEach(k => featured[k.dasherize()] = featuredStory.attrs[k]);
    server.create('listing-page', {
      id: 'shows/foo',
      featured,
      apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
    });
    server.get(`${config.publisherAPI}/v1/whats_on/`, {
      'wnyc-fm939': {
        current_show: {
          end: later,
          episode_pk: featuredStory.cmsPK,
        }
      }
    });

    await visit('shows/foo');

    let button = find('[data-test-selector=listen-button].is-live');
    assert.ok(button.textContent.match('Listen Live'));
    if (later.minutes() === 0) {
      assert.ok(button.textContent.match(later.format('h A')));
    } else {
      assert.ok(button.textContent.match(later.format('h:mm A')));
    }
  });
});

module('Acceptance | Listing Page | Analytics', function(hooks) {
  setupApplicationTest(hooks);

  test('metrics properly reports channel attrs', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo',
      cmsPK: 123,
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'}
      ],
      socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
      apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
    });

    assert.expect(1);

    server.post(`${config.platformEventsAPI}/v1/events/viewed`, (schema, {requestBody}) => {
      let {
        cms_id,
        item_type,
        browser_id,
        client,
        referrer,
        external_referrer,
        url,
        site_id
      } = JSON.parse(requestBody);
      let testObj = {
        cms_id: 123,
        item_type: 'show',
        browser_id: undefined,
        client: 'wnyc_web',
        external_referrer: document.referrer,
        referrer: location.toString(),
        url: location.toString(),
        site_id: config.siteId
      };
      assert.deepEqual({cms_id, item_type, browser_id, client, external_referrer, referrer, url, site_id}, testObj, 'params match up');
    });

    await visit('shows/foo');
  });

  test('listen buttons in story teases include data-action and data-label values', async function(assert) {
    let teaseList = server.createList('story', 5, {audioAvailable: true, showTitle: 'foo show'});
    server.create('listing-page', {
      id: 'shows/foo',
      cmsPK: 123,
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'}
      ],
      apiResponse: server.create('api-response', {
        id: 'shows/foo/episodes/1',
        teaseList
      })
    });


    await visit('shows/foo');

    let listenButtons = findAll('.story-tease [data-test-selector=listen-button]');
    listenButtons.forEach((el, i) => {
      assert.equal(el.getAttribute('data-action'), 'Clicked Play/Pause On Demand');
      assert.equal(el.getAttribute('data-label'), `${teaseList[i].title} | foo show`);
    })
  })
});
