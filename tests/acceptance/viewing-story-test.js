import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';
import storyPage from 'wnyc-web-client/tests/pages/story';
import { resetHTML } from 'wnyc-web-client/tests/helpers/html';
import config from 'wnyc-web-client/config/environment';
import sinon from 'sinon';


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
  server.get(`${config.wnycAdminRoot}/api/v1/is_logged_in/`, {is_staff: true});
  server.create('user');
  
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});

  djangoPage
    .bootstrap({id})
    .visit({id});
  storyPage.clickShowComments();
  andThen(() => assert.ok(find('.js-feature-comment').length, 'feature controls are visible'));
});

test('story pages with a play param', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});

  djangoPage
    .bootstrap({id})
    .visit({id: id + `?play=${story.id}`});
    
  andThen(function() {
    assert.equal(currentURL(), `story/${story.slug}/?play=${story.id}`);
    assert.ok(Ember.$('.persistent-player').length, 'persistent player should be visible');
    assert.equal(Ember.$('[data-test-selector=persistent-player-story-title]').text(), story.title, `${story.title} should be loaded in player UI`);
  });
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
  beforeEach() {
    window.googletag = {cmd: [], apiReady: true};
  },
  afterEach() {
    delete window.ga;
    window.googletag = {cmd: [], apiReady: true};
  }
});

test('metrics properly reports story attrs', function(assert) {
  let story = server.create('story');
  let id = `story/${story.slug}/`;
  
  assert.expect(2);
  server.create('django-page', {id, slug: story.slug});

  server.post(`${config.wnycAPI}/api/v1/itemview`, (schema, {requestBody}) => {
    let {
      cms_id,
      item_type,
      browser_id,
      client,
      referer,
      url
    } = JSON.parse(requestBody);
    let testObj = {
      cms_id: story.id,
      item_type: 'story',
      browser_id: undefined,
      client: 'wnyc_web',
      referer: location.toString(),
      url: location.toString()
    };
    assert.deepEqual({cms_id, item_type, browser_id, client, referer, url}, testObj, 'params match up');
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

test('google ads test', function(assert) {
  let story = server.create('story', {
    extendedStory: {
      tags: 'tags value',
      series: 'series value',
      channel: 'channel value',
      show: 'show value'
    }
  });
  let id = `story/${story.slug}/`;
  server.create('django-page', {id, slug: story.slug});
  
  let setTargetingSpy = sinon.spy();
  let refreshSpy      = sinon.spy();

  window.googletag.cmd = {
    push(fn) {
      fn();
    }
  };
  window.googletag.pubads = function() {
    return {
      refresh: refreshSpy,
      setTargeting: setTargetingSpy,
      addEventListener() {}
    };
  };
  
  djangoPage
    .bootstrap({id})
    .visit({id});
  
  andThen(function() {
    assert.equal(setTargetingSpy.callCount, 7, 'setTargeting called 7 times');
    assert.ok(setTargetingSpy.calledWith('url'), 'called set target for url');
    assert.ok(setTargetingSpy.calledWith('host'), 'called set target for host');
    assert.ok(setTargetingSpy.calledWith('fullurl'), 'called set target for fullurl');
    assert.ok(setTargetingSpy.calledWith('tag'), 'called set target for tag');
    assert.ok(setTargetingSpy.calledWith('show'), 'called set target for show');
    assert.ok(setTargetingSpy.calledWith('channel'), 'called set target for channel');
    assert.ok(setTargetingSpy.calledWith('series'), 'called set target for series');
    
    assert.ok(refreshSpy.calledOnce, 'refresh was called');
  });
});
