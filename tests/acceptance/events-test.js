import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | events', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /events', async function(assert) {
    server.create('django-page', {id: 'events/'});
    await visit('/events');

    assert.equal(currentURL(), `/events`);
  });

  test('clicking on /events', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'});
    server.create('django-page', {id: '/'});
    server.create('django-page', {id: 'events/'});
    
    await visit('/');
    
    await click('a[href="/events"]');
    
    assert.equal(currentURL(), `/events`);
  });

  test('transitioning to a specific event', async function(assert) {
    server.create('django-page', {
      id: 'fake/',
      testMarkup: `
      <a href="/events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/" id="foo">foo</a>
      `
    });
    server.create('django-page', {id: `events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/`});
    server.create('bucket', {slug: 'wqxr-home'});
    
    await visit('/fake');
    await click('#foo');
    
    assert.equal(currentURL(), `/events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/`);
  });
});
