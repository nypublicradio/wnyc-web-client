import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | streams', {
  beforeEach() {
    window.googletag = {cmd: [], apiReady: true};
  },
  afterEach() {
    window.googletag = {cmd: [], apiReady: true};
  }
});

test('visiting /streams', function(assert) {
  server.createList('stream', 7);
  server.createList('whats-on', 7);
  let refreshSpy = sinon.spy();
  
  window.googletag.cmd = {
    push(fn) {
      fn();
    }
  };
  window.googletag.pubads = function() {
    return {
      refresh: refreshSpy,
      addEventListener() {}
    };
  };
  
  visit('/streams');

  andThen(function() {
    assert.equal(currentURL(), '/streams');
    assert.equal(find('.stream-list li').length, 6, 'should display a list of streams');
    assert.ok(refreshSpy.calledOnce, 'refresh was called');
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
