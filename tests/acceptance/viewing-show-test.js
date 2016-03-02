import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import showPage from 'overhaul/tests/pages/show';
import { resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | Django Page | Show Page', {
  afterEach() {
    resetHTML();
  }
});

test('smoke test', function(assert) {
  let show = server.create('show', {
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}]
  });
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(currentURL(), `/${show.id}`);
    assert.ok(showPage.facebookIsVisible());
  });
});

test('visting a show - about smoke test', function(assert) {
  let show = server.create('show', {firstPage: 'about'});
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(showPage.aboutText(), 'About');
  });
});

test('visiting a show - story page smoke test', function(assert) {
  let show = server.create('show', {firstPage: 'story'});
  server.create('django-page', {id: show.id});

  djangoPage
    .bootstrap(show)
    .visit(show);

  andThen(() => {
    assert.equal(showPage.storyText(), 'Story body.');
  });
});

test('using a nav-link', function(assert) {
  let show = server.create('show', {
    linkroll: [
      {"href": null, "navSlug": "episodes", "title": "Episodes"},
      {"href": null, "navSlug": "next-link", "title": "Next Link"}
    ]
  });

  let story = server.create('story', {
    title: "Story Title"
  });

  server.create('api-response', {
    id: `${show.id}${show.linkroll[1].navSlug}/1`,
    teaseList: [server.schema.story.find(story.id)]
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
