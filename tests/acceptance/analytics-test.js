import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import config from 'overhaul/config/environment';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | Analytics', {
  beforeEach() {
    Ember.$.Velocity.mock = true;
    server.create('stream');
  },
  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('it does not log a pageview when opening and closing the queue', function(assert) {
  assert.expect(4);
  let done = assert.async();
  var pageViewEvent = sinon.spy();

  server.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, (schema, {queryParams}) => {
    if (queryParams.category === '_trackPageView') {
      pageViewEvent(queryParams);
    }
    return wait();
  });

  server.create('django-page', {id: '/'});
  visit('/');
  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 1, 'modal is open');
    assert.ok(pageViewEvent.calledOnce, 'trackpageViewEvent was only called once after opening queue');
  });

  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 0, 'modal is closed');
    assert.ok(pageViewEvent.calledOnce, 'trackPageView was only called once after opening and closing queue');
    done();
  });
});

test('it logs a homepage bucket event when you click a story on the home page', function(assert) {
  assert.expect(2);
  let done = assert.async();
  let homepageBucketEvent = sinon.spy();

  server.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, (schema, {queryParams}) => {
    if (queryParams.category === 'Homepage Bucket') {
      homepageBucketEvent(queryParams);
    }
    return wait();
  });

  let story = server.create('story');
  let id = `story/${story.slug}/`;
  let testMarkup = `
    <div id="wnyc_home">
      <div class="top-stories bucket" data-position="top">
        <h4 class="bucket-title">Top Stories</h4>
        <ul id="home-primary">
          <li class="first last">
            <a href="http:${config.wnycURL}/${id}" id="test-link">story link</a>
          </li>
        </ul>
      </div>
    </div>`;
  server.create('django-page', {id});
  server.create('django-page', {id: '/', testMarkup});

  visit('/');
  click('#test-link');

  andThen(() => {
    assert.equal(currentURL(), `/story/${story.slug}`, 'opened story page');
    assert.ok(homepageBucketEvent.calledOnce, 'bucket event was triggered once after clicking link');
    done();
  });
});
