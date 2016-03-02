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
  let show = server.create('show');
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});

test('showing no pagination on about pages', function(assert) {
  let show = server.create('show', {firstPage: 'about'});
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('showing no pagination on story detail listing pages', function(assert) {
  let show = server.create('show', {firstPage: 'story'});
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 0, 'is not showing pagination');
  });
});

test('can go back and forward', function(assert) {
  let show = server.create('show');
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
    assert.notEqual(firstStoryTitle, showPage.storyTitles()[0]);
    assert.equal(currentURL(), `/${show.id}${show.linkroll[0].navSlug}/2`, 'uses nav slug when paginating');
    showPage.clickBack();
  });
  andThen(function() {
    assert.equal(currentURL(), `/${show.id}${show.linkroll[0].navSlug}/1`, 'uses nav slug when paginating');
    assert.equal(firstStoryTitle, showPage.storyTitles()[0]);
  });
});

test('can navigate to a specified page of results', function(assert) {
  let show = server.create('show');
  server.create('django-page', {id: show.id});
  let firstStoryTitle;

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    showPage.clickPage(5);
  });
  andThen(function() {
    assert.notEqual(firstStoryTitle, showPage.storyTitles()[0]);
    assert.equal(currentURL(), `/${show.id}${show.linkroll[0].navSlug}/5`, 'uses nav slug when paginating');
  });
});
