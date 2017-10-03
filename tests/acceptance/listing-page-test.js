import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import showPage from 'wqxr-web-client/tests/pages/show';
import config from 'wqxr-web-client/config/environment';
import moment from 'moment';

moduleForAcceptance('Acceptance | Listing Page | viewing', {
  beforeEach() {
    server.create('stream');
    window.assign = function() {};
  },
});

test('smoke test', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(currentURL(), `${listingPage.id}`);
    assert.ok(findWithAssert('.sitechrome-btn'), 'donate chunk should reset after navigating');
    assert.ok(showPage.facebookIsVisible());
    assert.notOk(find('[data-test-selector="admin-link"]').length, 'edit link should not be visible');
  });
});

test('authenticated smoke test', function(assert) {
  server.get(`${config.adminRoot}/api/v1/is_logged_in/`, {is_staff: true});
  server.create('user');
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(() => {
    andThen(() => assert.ok(find('[data-test-selector="admin-link"]').length, 'edit links are visible'));
  });
});

test('about smoke test', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'about', title: 'About'},
    ],
    apiResponse: server.create('api-response', { id: 'shows/foo/about' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(showPage.aboutText(), 'About');
  });
});

test('visiting a listing page - story page smoke test', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/story/1',
    type: 'story',
    story: server.create('story')
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'story', title: 'Story'}
    ],
    apiResponse
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(() => {
    assert.equal(showPage.storyText(), 'Story body.');
  });
});

test('scripts in well route content will execute', function(assert) {
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

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'story', title: 'Story'}
    ],
    apiResponse
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(find('[data-test-selector=story-detail] p').length, 1, 'should only be one p tag');
    let text = find('[data-test-selector=story-detail] .django-content').find('p, div').map((_, e) => e.innerText).get().join(' ');
    assert.equal(text, 'test body. Added this paragraph!');
  });
});

test('using a nav-link', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/episodes/1',
    teaseList: server.createList('story', 10)
  });
  server.create('api-response', {
    id: 'shows/foo/next-link/1',
    teaseList: server.createList('story', 1, {title: 'Story Title'})
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'},
      {'nav-slug': 'next-link', title: 'Next Link'}
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  showPage.clickNavLink('Next Link');

  andThen(() => {
    assert.deepEqual(showPage.storyTitles(), ["Story Title"]);
  });
});

test('visiting directly to a nav link url', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/episodes/1',
    teaseList: server.createList('story', 10)
  });
  server.create('api-response', {
    id: 'shows/foo/next-link/1',
    teaseList: server.createList('story', 1, {title: 'Story Title'})
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'},
      {'nav-slug': 'next-link', title: 'Next Link'}
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit({id: 'shows/foo/next-link/'});

  andThen(() => {
    assert.equal(currentURL(), `shows/foo/next-link/`);

    assert.equal(findWithAssert('nav li.is-active > a').text(), 'Next Link');
  });
});

test('null social links should not break page', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/recent_stories/1',
    teaseList: server.createList('story', 10)
  });
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    socialLinks: null,
    apiResponse
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(currentURL(), `${listingPage.id}`);
  });
});

test('undefined social links should not break page', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/recent_stories/1',
    teaseList: server.createList('story', 10)
  });
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    socialLinks: undefined,
    apiResponse
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(currentURL(), `${listingPage.id}`);
  });
});

test('visiting a show with a different header donate chunk', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
    apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
  });
  server.create('django-page', {id: listingPage.id});
  server.create('django-page', {id: 'fake/'});
  server.create('bucket', {slug: 'wqxr-home'}); // redirected to homepage

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(find('.foo').text(), 'donate to foo', 'donate chunk should match');
  });

  andThen(function() {
    click(find('a[href="/"]'));
  });

  andThen(function() {
    assert.ok(findWithAssert('.sitechrome-btn'), 'donate chunk should reset after navigating');
  });
});

test('show pages with a play param', function(assert) {
  let story = server.create('story');
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit({id: listingPage.id + `?play=${story.slug}`});

  andThen(function() {
    assert.equal(currentURL(), `${listingPage.id}?play=${story.slug}`);
    assert.ok(find('.nypr-player').length, 'persistent player should be visible');
    assert.equal(find('[data-test-selector=nypr-player-story-title]').text(), story.title, `${story.title} should be loaded in player UI`);
  });

});

test('show pages with a listen live chunk', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/'
  });
  server.create('api-response', { id: 'shows/foo/recent_stories/1' });

  server.create('chunk', {
    id: 'shows-foo-listenlive',
    content: 'foo bar text'
  });
  server.create('django-page', {id: listingPage.id});
  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);
  
  andThen(() => {
    assert.equal(find('.channel-header .django-content').text().trim(), 'foo bar text');
  });
});

test('channel routes do dfp targeting', function(/*assert*/) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/'
  });
  server.create('api-response', { id: 'shows/foo/recent_stories/1' });
  server.create('django-page', {id: listingPage.id});
  
  // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
  visit('/');

  andThen(() => {
    this.mock(this.application.__container__.lookup('route:show').get('googleAds'))
      .expects('doTargeting')
      .once();
  });
  
  djangoPage
    .bootstrap({id: listingPage.id})
    .visit({id: listingPage.id});
});

test('if a show is airing, the featured story listen button says "Listen Live"', function(assert) {
  let now = moment();
  let later = now.add(1, 'hour');
  let featuredStory = server.create('story', {
    isLatest: true,
    newsdate: now.toDate()
  });
  let featured = {};
  Object.keys(featuredStory.attrs).forEach(k => featured[k.dasherize()] = featuredStory.attrs[k]);
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
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
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(() => {
    let button = find('[data-test-selector=listen-button]');
    assert.ok(button.text().match('Listen Live'));
    if (later.minutes() === 0) {
      assert.ok(button.text().match(later.format('h A')));
    } else {
      assert.ok(button.text().match(later.format('h:mm A')));
    }
  });
});

moduleForAcceptance('Acceptance | Listing Page | Analytics');

test('metrics properly reports channel attrs', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    cmsPK: 123,
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });

  assert.expect(2);

  server.create('django-page', {id: listingPage.id});
  
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
      client: 'wqxr_web',
      external_referrer: document.referrer,
      referrer: location.toString(),
      url: location.toString(),
      site_id: config.siteId
    };
    assert.deepEqual({cms_id, item_type, browser_id, client, external_referrer, referrer, url, site_id}, testObj, 'params match up');
  });

  window.ga = function(command) {
    if (command === 'npr.send') {
      assert.ok('called npr.send');
    }
  };

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);
});

test('listen buttons in story teases include data-story and data-show values', function(assert) {
  let teaseList = server.createList('story', 5, {audioAvailable: true, showTitle: 'foo show'});
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    cmsPK: 123,
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    apiResponse: server.create('api-response', {
      id: 'shows/foo/episodes/1',
      teaseList
    })
  });
  server.create('django-page', {id: listingPage.id});


  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(() => {
    let listenButtons = findWithAssert('.story-tease [data-test-selector=listen-button]');
    listenButtons.each((i, el) => {
      assert.equal($(el).attr('data-show'), 'foo show');
      assert.equal($(el).attr('data-story'), teaseList[i].title);
    })
  });
})
