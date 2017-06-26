import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import showPage from 'wqxr-web-client/tests/pages/show';
import { resetHTML } from 'wqxr-web-client/tests/helpers/html';

moduleForAcceptance('Acceptance | Listing Page | paginating', {
  afterEach() {
    resetHTML();
  }
});

test('showing pagination for a list of episodes', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/episodes/1',
    teaseList: server.createList('story', 10),
    totalCount: 50
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'}
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});

test('showing no pagination on about pages', function(assert) {
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'about', title: 'About'},
    ],
    apiResponse: server.create('api-response', { id: 'shows/foo/about' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('showing no pagination on story detail listing pages', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/story/1',
    story: server.create('story')
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'story', title: 'Story'}
    ],
    apiResponse
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('can go back and forward', function(assert) {
  let api1 = 'shows/foo/episodes/1';
  let api2 = 'shows/foo/episodes/2';

  let apiResponse = server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 10),
    totalCount: 50
  });
  server.create('api-response', {
    id: api2,
    teaseList: server.createList('story', 10),
    totalCount: 50
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});
  let firstStoryTitle;

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    firstStoryTitle = showPage.storyTitles()[0];
    showPage.clickNext();
  });
  andThen(function() {
    assert.notEqual(firstStoryTitle, showPage.storyTitles()[0], 'first story title should be different');
    assert.equal(currentURL(), `/${api2}`, 'uses nav slug when paginating');
    showPage.clickBack();
  });
  andThen(function() {
    assert.equal(currentURL(), `/${api1}`, 'uses nav slug when paginating');
    assert.equal(firstStoryTitle, showPage.storyTitles()[0], 'first story title should be the same');
  });
});

test('proper paginating for listing pages without a linkroll', function(assert) {
  // api-responses without a linkroll associated are just the stories associated
  // with the listing object
  let api1 = 'shows/foo/recent_stories/1';
  let api2 = 'shows/foo/recent_stories/2';

  let apiResponse = server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 10),
    totalCount: 50
  });
  server.create('api-response', {
    id: api2,
    teaseList: server.createList('story', 10),
    totalCount: 50
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.equal(currentURL(), 'shows/foo/');
    showPage.clickNext();
  });
  andThen(function() {
    assert.equal(currentURL(), '/shows/foo/2', 'correct url when paginating');
    showPage.clickBack();
  });
  andThen(function() {
    assert.equal(currentURL(), '/shows/foo/1', 'adds page number when going back');
  });
});

test('can navigate to a specified page of results', function(assert) {
  let api1 = 'shows/foo/episodes/1';
  let api4 = 'shows/foo/episodes/4';

  let apiResponse = server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 10),
    totalCount: 500
  });
  server.create('api-response', {
    id: api4,
    teaseList: server.createList('story', 10)
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  let firstStoryTitle;

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    firstStoryTitle = showPage.storyTitles()[0];
    showPage.clickPage(4);
  });
  andThen(function() {
    assert.notEqual(firstStoryTitle, showPage.storyTitles()[0]);
    assert.equal(currentURL(), `/${api4}`, 'uses nav slug when paginating');
  });
});

test('can land on a page number', function(assert) {
  let api1 = 'shows/foo/episodes/1';
  let api5 = 'shows/foo/episodes/5';

  let apiResponse = server.create('api-response', {
    id: api5,
    teaseList: server.createList('story', 10),
    totalCount: 60
  });
  server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 50)
  });

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage);
  
  visit(`/${api5}`);

  andThen(function() {
    assert.equal(currentURL(), `/${api5}`, 'can land directly on a page of results');
    assert.equal(find('.pagefooter-current').text().trim(), '5', 'current page number is 5');
  });
});

test('it only shows ten pages at a time', function(assert) {
  let apiResponse = server.create('api-response', {
    id: `shows/foo/episodes/1`,
    teaseList: server.createList('story', 10),
    totalCount: 500
  });
  
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [{navSlug: 'episodes', title: 'Episodes'}],
    apiResponse
  });
  
  server.create('django-page', {id: listingPage.id});
  
  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);
  
  andThen(function() {
    assert.equal(find('.pagefooter-current').length, 1, 'one current page number');
    assert.equal(find('.pagefooter-link').length, 10, 'links 2-9 and one final page');
    assert.equal(find('.dots').length, 1, 'should only be one set of dots');
    assert.equal(find('.dots').next('.pagefooter-link').text().trim(), '50', 'final link should follow dots');
    assert.equal(find('.pagefooter-link:last').text().trim(), '50', 'final link should be 50');
  });
});

test('clicking on a page number takes to the page of the correct tab', function(assert) {
  let episodesPage1 = 'shows/foo/episodes/1';
  let apiResponse = server.create('api-response', {
    id: episodesPage1,
    teaseList: server.createList('story', 10),
    totalCount: 60
  });
  let segmentsPage1 = 'shows/foo/segments/1';
  let segmentsPage3 = 'shows/foo/segments/3';
  
  server.create('api-response', {
    id: segmentsPage1,
    teaseList: server.createList('story', 10),
    totalCount: 60
  });
  server.create('api-response', {
    id: segmentsPage3,
    teaseList: server.createList('story', 10),
    totalCount: 60
  });
  
  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
      {navSlug: 'segments', title: 'Segments'}
    ],
    apiResponse
  });

  server.create('django-page', {id: listingPage.id});
  
  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);
  
  andThen(() => {
    showPage.clickNavLink('Segments');
  });
  andThen(() => {
    showPage.clickPage(3);
  });
  andThen(() => {
    assert.equal(currentURL(), `/${segmentsPage3}`);
  });
});
