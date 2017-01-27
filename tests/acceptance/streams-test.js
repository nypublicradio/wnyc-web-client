import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | streams');

test('visiting /streams', function(assert) {
  server.createList('stream', 7);
  server.createList('whats-on', 7);
  let refreshSpy = sinon.spy();

  window.googletag = {
    apiReady: true,
    cmd: {
      push(fn) {
        fn();
      }
    },
    pubads() {
      return {
        refresh: refreshSpy
      };
    }
  };
  
  visit('/streams');

  andThen(function() {
    assert.equal(currentURL(), '/streams');
    assert.equal(find('.stream-list li').length, 7, 'should display a list of streams');
    assert.ok(refreshSpy.calledOnce, 'refresh was called');
    
    window.googletag = null;
  });
});

test('playing a stream', function(assert) {
  server.createList('stream', 7);
  server.createList('whats-on', 7);
  
  visit('/streams');
  
  click('.stream-list li:first button');
  
  andThen(function() {
    assert.ok(findWithAssert('.persistent-player'), 'persistent player should be visible');
  });
});
