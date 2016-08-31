import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import showPage from 'overhaul/tests/pages/show';
import { resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | Django Page | paginating show listings', {
  afterEach() {
    resetHTML();
  }
});

test('showing pagination for a list of episodes', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/episodes/1',
    teaseList: server.createList('story', 50)
  });

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'}
    ],
    apiResponse
  });

  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});

test('showing no pagination on about pages', function(assert) {
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
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('showing no pagination on story detail listing pages', function(assert) {
  let apiResponse = server.create('api-response', {
    id: 'shows/foo/story/1',
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

  andThen(function() {
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('can go back and forward', function(assert) {
  let api1 = 'shows/foo/episodes/1';
  let api2 = 'shows/foo/episodes/2';

  let apiResponse = server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 50)
  });
  server.create('api-response', {
    id: api2,
    teaseList: server.createList('story', 50)
  });

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
    ],
    apiResponse
  });

  server.create('django-page', {id: show.id});
  let firstStoryTitle;

  djangoPage
    .bootstrap(show)
    .visit(show);

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

test('can navigate to a specified page of results', function(assert) {
  let api1 = 'shows/foo/episodes/1';
  let api5 = 'shows/foo/episodes/5';

  let apiResponse = server.create('api-response', {
    id: api1,
    teaseList: server.createList('story', 50)
  });
  server.create('api-response', {
    id: api5,
    teaseList: server.createList('story', 50)
  });

  let show = server.create('show', {
    id: 'shows/foo/',
    linkroll: [
      {navSlug: 'episodes', title: 'Episodes'},
    ],
    apiResponse
  });

  server.create('django-page', {id: show.id});

  let firstStoryTitle;

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    firstStoryTitle = showPage.storyTitles()[0];
    showPage.clickPage(5);
  });
  andThen(function() {
    assert.notEqual(firstStoryTitle, showPage.storyTitles()[0]);
    assert.equal(currentURL(), `/${api5}`, 'uses nav slug when paginating');
  });
});
