import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | streams');

test('visiting /streams', function(assert) {
  server.createList('stream', 7);
  server.createList('whats-on', 7);
  
  visit('/streams');

  andThen(function() {
    assert.equal(currentURL(), '/streams');
    assert.equal(find('.stream-list li').length, 7, 'should display a list of streams');
  });
});

test('playing a stream', function(assert) {
  server.createList('stream', 7);
  server.createList('whats-on', 7);

  visit('/streams');

  click('.stream-list li:first button');

  andThen(function() {
    assert.ok(findWithAssert('.nypr-player'), 'persistent player should be visible');
  });
});
