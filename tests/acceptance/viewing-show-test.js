import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import showPage from 'overhaul/tests/pages/show';
import { appendHTML, resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | viewing show', {
  beforeEach() {
    appendHTML('<div id="js-listings"></div>');
  },

  afterEach() {
    resetHTML();
  }
});

test('visiting a show - listing smoke test', function(assert) {
  let show = server.create('show');

  showPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(currentURL(), `/${show.id}`);
  });
});

test('visting a show - about smoke test', function(assert) {
  let show = server.create('show', {firstPage: 'about'});

  showPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(showPage.aboutText(), 'About');
  });
});

test('visiting a show - story page smoke test', function(assert) {
  let show = server.create('show', {firstPage: 'story'});

  showPage
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

  showPage
    .bootstrap(show)
    .visit(show)
    .clickNavLink('Next Link');

  andThen(() => {
    assert.deepEqual(showPage.storyTitles(), ["Story Title"]);
  });
});
