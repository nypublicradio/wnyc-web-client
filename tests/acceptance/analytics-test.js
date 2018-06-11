import { click, find, currentURL, visit } from '@ember/test-helpers';
import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import config from 'wnyc-web-client/config/environment';
import velocity from 'velocity';

module('Acceptance | Analytics', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    velocity.mock = true;
    server.create('stream');
  });

  hooks.afterEach(function() {
    velocity.mock = false;
  });

  test('it does not log a pageview when opening and closing the queue', async function(assert) {
    let metrics = this.owner.lookup('service:metrics');
    let trackPage = this.spy(metrics, 'trackPage').withArgs('GoogleAnalytics');

    server.create('django-page', {id: '/'});
    await visit('/');
    await click('.nypr-player-queue-button.is-floating');

    assert.ok(find('.l-sliding-modal'), 'modal is open');
    assert.equal(trackPage.callCount, 1, 'trackpageViewEvent was only called once after opening queue');

    await click('.nypr-player-queue-button.is-floating');

    assert.notOk(find('.l-sliding-modal'), 'modal is closed');
    assert.equal(trackPage.callCount, 1, 'trackPageView was only called once after opening and closing queue');
  });

  test('it logs a homepage bucket event when you click a story on the home page', async function(assert) {
    let metrics = this.owner.lookup('service:metrics');
    let trackSpy = this.spy(metrics, 'trackEvent');

    let story = server.create('story');
    let id = `story/${story.slug}/`;
    let testMarkup = `
      <div id="wnyc_home">
        <div class="top-stories bucket" data-position="top">
          <h4 class="bucket-title">Top Stories</h4>
          <ul id="home-primary">
            <li class="first last">
              <a href="${config.webRoot}/${id}" id="test-link">story link</a>
            </li>
          </ul>
        </div>
      </div>`;
    server.create('django-page', {id});
    server.create('django-page', {id: '/', testMarkup});

    await visit('/');
    await click('#test-link');

    assert.equal(currentURL(), `/story/${story.slug}`, 'opened story page');
    assert.equal(trackSpy.firstCall.args[1].category, 'Homepage Bucket', 'bucket event was triggered once after clicking link');
  });

  test('it registers the browser id with the dj service', async function() {
    const ID = 'foo';
    let session = this.owner.lookup('service:session');
    let dj = this.owner.lookup('service:dj');

    this.mock(session).expects('syncBrowserId').once().resolves(ID);
    this.mock(dj).expects('addBrowserId').withArgs(ID);

    server.create('django-page', {id: '/'});
    await visit('/');
  });
});
