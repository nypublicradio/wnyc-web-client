import {
  click,
  currentURL,
  find,
  visit,
  waitFor
} from '@ember/test-helpers';
import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { registerMockOnInstance } from 'wnyc-web-client/tests/helpers/register-mock';
import velocity from 'velocity';
import { dummyHifi } from 'wnyc-web-client/tests/helpers/hifi-integration-helpers';


velocity.mock = true;

module('Acceptance | play param', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
    registerMockOnInstance(this.owner, 'service:hifi', dummyHifi);
  });

  test('play param transitions', async function(assert) {
    let dj = this.owner.lookup('service:dj');
    this.stub(dj, 'play');

    server.create('django-page', {
      id: '/',
      testMarkup: `
        <a href="/foo?play=wnyc-fm939" id="foo">foo</a>
      `
    });
    server.create('django-page', {
      id: 'foo/',
      testMarkup: `
        <a href="/" id="home">home</a>
      `
    });
    await visit('/');
    await click('#foo');

    assert.equal(currentURL(), '/foo?play=wnyc-fm939', 'url should have ?play');
    await click('#home');

    // assert.equal(currentURL(), '/', 'homepage should not have a query param');
    assert.ok(dj.play.calledOnce, 'play should not be called again');
    assert.ok(dj.play.calledWith('wnyc-fm939'), 'play should be called');
  });

  test('loading a page with the ?play param', async function(assert) {
    let slug = 'foo';

    server.create('story', {slug, title: 'Foo'});
    server.create('django-page', {id: '/'});

    await visit(`/?play=${slug}`);
    await waitFor('.nypr-player');

    assert.equal(find('[data-test-selector=nypr-player-story-title]').textContent.trim(), 'Foo', 'Foo story should be loaded in player UI');
  });

  test('loading a page with a bad ?play param', async function(assert) {
    let id = '1';
    server.create('django-page', {id: `/bar?play=${id}`});

    await visit(`bar?play=${id}`);
    assert.notOk(find('.nypr-player'), 'persistent player should not be visible');
  });
});
