import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | streams');

let streamsRun = false;
function setupStreams() {
  if (streamsRun) {
    // streams and whats-on items are linked via slug
    // factories are set up to only with with the first 7 created
    return;
  }
  streamsRun = true;
  server.createList('stream', 7);
  server.createList('whats-on', 7);
}

test('visiting /streams', function(assert) {
  setupStreams();
  
  visit('/streams');

  andThen(function() {
    assert.equal(currentURL(), '/streams');
    assert.equal(find('.stream-list li').length, 7, 'should display a list of streams');
  });
});
