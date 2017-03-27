import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | events', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /events', function(assert) {
  server.create('django-page', {id: `events`});
  visit('/events');

  andThen(function() {
    assert.equal(currentURL(), `/events`);
  });
});

test('clicking on /events', function(assert) {
  server.create('bucket', {slug: 'wqxr-home'});
  server.create('django-page', {id: '/'});
  server.create('django-page', {id: `events`});
  
  visit('/');
  
  andThen(function() {
    click('a[href="/events"]');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/events`);
  });
});

test('transitioning to a specific event', function(assert) {
  server.create('django-page', {
    id: 'fake/',
    testMarkup: `
    <a href="/events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/" id="foo">foo</a>
    `
  });
  server.create('django-page', {id: `events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/`});
  server.create('bucket', {slug: 'wqxr-home'});
  
  visit('/fake');
  click('#foo');
  
  andThen(function() {
    assert.equal(currentURL(), `/events/wqxr-media-sponsorship/2016/jan/29/ecstatic-music-festival-2016/`);
  });
});
