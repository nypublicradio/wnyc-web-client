import config from 'wqxr-web-client/config/environment';
import { moduleFor, skip } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('service:metrics', 'Unit | Service | metrics', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  needs: [
    'metrics-adapter:google-analytics',
    'metrics-adapter:npr-analytics',
    // 'metrics-adapter:google-tag-manager',
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

skip('calling tracking events does not call npr tracking events', function(assert) {
  let service = this.subject({options: config});

  let nprTrackPageSpy = this.spy(service._adapters.NprAnalytics, 'trackPage');
  let nprTrackEventSpy = this.spy(service._adapters.NprAnalytics, 'trackEvent');

  let gaTrackPageSpy = this.spy(service._adapters.GoogleAnalytics, 'trackPage');
  let gaTrackEventSpy = this.spy(service._adapters.GoogleAnalytics, 'trackEvent');

  service.trackPage({ page: '/foo', title: 'foo' });

  assert.notOk(nprTrackPageSpy.returnValue, 'npr trackPage should not be called');
  assert.equal(gaTrackPageSpy.callCount, 1, 'ga trackPage should be called');
  // assert.equal(gtmTrackPageSpy.callCount, 1, 'gtm trackPage should be called');

  service.trackEvent({ category: 'foo', action: 'bar', label: 'baz' });

  assert.notOk(nprTrackEventSpy.returnValue, 'npr trackEvent should not be called');
  assert.equal(gaTrackEventSpy.callCount, 1, 'ga trackEvent should be called');
});
