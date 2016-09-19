import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import storyPage from 'overhaul/tests/pages/story';
import { resetHTML } from 'overhaul/tests/helpers/html';
import config from 'overhaul/config/environment';
import { authenticateSession } from 'overhaul/tests/helpers/ember-simple-auth';


moduleForAcceptance('Acceptance | Django Page | Story Detail', {
  afterEach() {
    resetHTML();
  }
});

test('smoke test', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});

  djangoPage
    .bootstrap({id})
    .visit({id});
    
  andThen(() => {
    assert.equal(currentURL(), `story/${story.slug}/`);
    assert.ok(find('.sitechrome-btn'), 'donate button should be the default');
  });
});

test('view comments as regular user', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});

  djangoPage
    .bootstrap({id})
    .visit({id});
    
  storyPage.clickShowComments();

  andThen(() => {
    assert.ok(storyPage.commentsVisible, 'comments are visible');
    assert.notOk(find('.js-feature-comment').length, 'feature controls are visible');
  });
});

test('view comments as staff user', function(assert) {
  authenticateSession(this.application, {is_staff: true});
  
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});

  djangoPage
    .bootstrap({id})
    .visit({id});
  storyPage.clickShowComments();
  andThen(() => assert.ok(find('.js-feature-comment').length, 'feature controls are visible'));
});

moduleForAcceptance('Acceptance | Django Page | Story Donate URLs', {
  afterEach() {
    resetHTML();
  }
});

test('visiting a story with a different donate URL', function(assert) {
  let donateStory = server.create('story', {
    extendedStory: {
      headerDonateChunk: '<a href="http://foo.com" class="foo">donate to foo</a>',
    }
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

moduleForAcceptance('Acceptance | Django Page | Story Detail Analytics', {
  afterEach() {
    delete window.ga;
  }
});

test('metrics properly reports story attrs', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  
  assert.expect(4);
  server.create('django-page', {id, slug: story.slug});

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
      if (['category', 'action', 'label', 'cms_id', 'cms_type'].contains(k)) {
        postParams[k] = v;
      }
    });
    let { category, action, label, cms_id, cms_type } = queryParams;
    let testObj = {
      category: 'Viewed Story',
      action: story.analytics.containers,
      label: story.analytics.title,
      cms_id: story.id,
      cms_type: 'story'
    };
    assert.deepEqual({category, action, cms_id, cms_type, label}, testObj, 'GET params match up');
    assert.deepEqual(postParams, testObj, 'POST params match up');
  });
  
  server.post(`${config.wnycAccountRoot}/api/most/view/managed_item/:pk`, (schema, {params}) => {
    assert.equal(params.pk, story.id, 'reports a managed item view');
  });
  
  window.ga = function(command) {
    if (command === 'npr.send') {
      assert.ok('called npr.send');
    }
  };
  
  djangoPage
    .bootstrap({id})
    .visit({id});
});
