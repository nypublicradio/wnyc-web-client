import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import storyPage from 'overhaul/tests/pages/story';
import { resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | Django Page | Story Detail', {
  beforeEach() {
    this.story = server.create('story');
    let id = `story/${this.story.slug}/`;
    server.create('django-page', {id, slug: this.story.slug});

    djangoPage
      .bootstrap({id})
      .visit({id});
  },
  afterEach() {
    resetHTML();
  }
});

test('smoke test', function(assert) {
  assert.equal(currentURL(), `story/${this.story.slug}/`);
  assert.ok(find('.sitechrome-btn'), 'donate button should be the default');
});

test('view comments', function(assert) {
  storyPage.clickShowComments();

  andThen(() => assert.ok(storyPage.commentsVisible));
});

moduleForAcceptance('Acceptance | Django Page | Story Donate URLs', {
  afterEach() {
    resetHTML();
  }
});

test('visiting a story with a different donate URL', function(assert) {
  let donateStory = server.create('story', {
    headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
  });
  let id = `story/${donateStory.slug}/`;
  server.create('django-page', {
    id,
    slug: donateStory.slug
  });
  
  djangoPage
    .bootstrap({id})
    .visit({id});
    
  andThen(function() {
    assert.equal(find('.foo').text(), 'donate to foo', 'donate chunk should match');
  });
});
