import { moduleFor, test } from 'ember-qunit';
import config from 'wnyc-web-client/config/environment';

moduleFor('metrics-adapter:npr-analytics', 'npr-analytics adapter', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('it inits itself against the window.ga object', function(assert) {
  window.ga = function(command, key) {
    assert.equal(command, 'create');
    assert.equal(key, config.nprGoogleAnalyticsKey);
  };
  let adapter = this.subject({config: {id: config.nprGoogleAnalyticsKey}});
  assert.ok(adapter);
});

test('it fails gracefully if window.ga does not exist', function(assert) {
  delete window.ga;
  let adapter = this.subject({config: {id: config.nprGoogleAnalyticsKey}});
  assert.ok(adapter);
});

test('it fires the correct pageview event', function(assert) {
  let adapter = this.subject({config: {id: config.nprGoogleAnalyticsKey}});
  window.ga = function(command, {hitType}) {
    if (command === 'npr.send') {
      assert.equal(command, 'npr.send', 'should prefix send with npr label');
      assert.equal(hitType, 'pageview', 'should send an npr pageview');
    }
  };
  adapter.trackPage({ page: '/foo', title: 'foo', isNpr: true });
});

test('it fires the correct trackEvent event', function(assert) {
  let adapter = this.subject({config: {id: config.nprGoogleAnalyticsKey}});
  window.ga = function(command, hitType) {
    if (command === 'npr.send') {
      assert.equal(command, 'npr.send', 'should prefix send with npr label');
      assert.equal(hitType, 'event', 'should send an npr event');
    }
  };
  adapter.trackEvent({ category: 'foo', action: 'bar', label: 'baz', isNpr: true });
});
