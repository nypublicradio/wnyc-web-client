import config from 'wqxr-web-client/config/environment';
import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Service | metrics', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:metrics');
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

    service.trackEvent({ category: 'foo', action: 'bar', label: 'baz' });

    assert.notOk(nprTrackEventSpy.returnValue, 'npr trackEvent should not be called');
    assert.equal(gaTrackEventSpy.callCount, 1, 'ga trackEvent should be called');
  });
});
