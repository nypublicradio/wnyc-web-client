import { click, find, visit } from '@ember/test-helpers';
import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
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
