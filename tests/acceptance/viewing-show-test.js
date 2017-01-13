import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';
import showPage from 'wnyc-web-client/tests/pages/show';
import { resetHTML } from 'wnyc-web-client/tests/helpers/html';
import config from 'wnyc-web-client/config/environment';

moduleForAcceptance('Acceptance | Django Page | Show Page', {
  beforeEach() {
    server.create('stream');
  },
  afterEach() {
    resetHTML();
  }
});

test('smoke test', function(assert) {
  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(currentURL(), `${show.id}`);
    assert.ok(findWithAssert('.sitechrome-btn'), 'donate chunk should reset after navigating');
    assert.ok(showPage.facebookIsVisible());
    assert.notOk(find('[data-test-selector="admin-link"]').length, 'edit link should not be visible');
  });
});

test('authenticated smoke test', function(assert) {
  server.get(`${config.wnycAccountRoot}/api/v1/is_logged_in/`, {is_staff: true});
  server.create('user');
  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(() => {
    andThen(() => assert.ok(find('[data-test-selector="admin-link"]').length, 'edit links are visible'));
  });
});

test('about smoke test', function(assert) {
  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'about', title: 'About'},
    ],
    apiResponse: server.create('api-response', { id: 'shows/foo/about' })
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(showPage.aboutText(), 'About');
  });
});

test('visiting a show - story page smoke test', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/story/1',
    type: 'story',
    story: server.create('story')
  });

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'story', title: 'Story'}
    ],
    apiResponse
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(() => {
    assert.equal(showPage.storyText(), 'Story body.');
  });
});

test('scripts in well route content will execute', function(assert) {
  let story = server.create('story', {
    id: 'story/foo/',
    slug: 'foo',
    extendedStory: {
      body: `test body.
<script type="text/deferred-javascript">
(function(){

  var p = document.createElement("p");
  p.innerHTML = "Added this paragraph!";
  document.querySelector("[data-test-selector=story-detail] .l-constrained").appendChild(p);

})();
\\x3C/script>
`
  }
  });
  
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/story/1',
    type: 'story',
    story
  });

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'story', title: 'Story'}
    ],
    apiResponse
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('[data-test-selector=story-detail] p').length, 1, 'should only be one p tag');
    let text = find('[data-test-selector=story-detail] .l-constrained').text().split('\n').filter(s => s).join(' ');
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

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
      {navSlug: 'next-link', title: 'Next Link'}
    ],
    apiResponse
  });

  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

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

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
      {navSlug: 'next-link', title: 'Next Link'}
    ],
    apiResponse
  });

  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit({id: 'shows/foo/next-link/'});

  andThen(() => {
    assert.equal(findWithAssert('nav li.is-active > a').text(), 'Next Link');
  });
});

test('null social links should not break page', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/recent_stories/1',
    teaseList: server.createList('story', 10)
  });
  let show = server.create('show', {
    id: 'shows/foo/',
    socialLinks: null,
    apiResponse
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(currentURL(), `${show.id}`);
  });
});

test('undefined social links should not break page', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/recent_stories/1',
    teaseList: server.createList('story', 10)
  });
  let show = server.create('show', {
    id: 'shows/foo/',
    socialLinks: undefined,
    apiResponse
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(currentURL(), `${show.id}`);
  });
});

test('visiting a show with a different header donate chunk', function(assert) {
  let show = server.create('show', {
    id: 'shows/foo/',
    headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
    apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
  });
  server.create('django-page', {id: show.id});
  server.create('django-page', {id: '/'});

  djangoPage
    .bootstrap(show)
    .visit(show);

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
  let show = server.create('show', {
    id: 'shows/foo/',
    apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' })
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit({id: show.id + `?play=${story.id}`});
    
  andThen(function() {
    assert.equal(currentURL(), `${show.id}?play=${story.id}`);
    assert.ok(Ember.$('.persistent-player').length, 'persistent player should be visible');
    assert.equal(Ember.$('[data-test-selector=persistent-player-story-title]').text(), story.title, `${story.title} should be loaded in player UI`);
  });
  
});

moduleForAcceptance('Acceptance | Django Page | Show Page Analytics', {
  afterEach() {
    delete window.ga;
  }
});

test('metrics properly reports channel attrs', function(assert) {
  let show = server.create('show', {
    id: 'shows/foo/',
    cmsPK: 123,
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  
  assert.expect(3);
  server.create('django-page', {id: show.id});
  
  server.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, (schema, {queryParams, requestBody}) => {
    // skip trackPageView event
    if (queryParams.category === '_trackPageView') {
      return true;
    }
    let postParams = {};
    requestBody.split('&').forEach(kv => {
      let params = kv.split('=');
      let k = params[0];
      let v = decodeURIComponent(params[1]).replace(/\+/g, ' ');
      if (['category', 'action', 'cms_id', 'cms_type'].includes(k)) {
        postParams[k] = v;
      }
    });
    let { category, action, /* label,*/ cms_id, cms_type } = queryParams;
    let testObj = {
      category: 'Viewed Show',
      action: show.title,
      cms_id: '123',
      cms_type: 'show'
    };
    assert.deepEqual({category, action, cms_id, cms_type}, testObj, 'GET params match up');
    assert.deepEqual(postParams, testObj, 'POST params match up');
  });
  
  window.ga = function(command) {
    if (command === 'npr.send') {
      assert.ok('called npr.send');
    }
  };
  
  djangoPage
    .bootstrap(show)
    .visit(show);
});
