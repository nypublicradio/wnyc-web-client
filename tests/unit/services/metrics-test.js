import config from 'wnyc-web-client/config/environment';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('service:metrics', 'Unit | Service | metrics', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  needs: [
    'metrics-adapter:google-analytics',
    'metrics-adapter:npr-analytics',
    'metrics-adapter:data-warehouse'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('calling tracking events does not call npr tracking events', function(assert) {
  let service = this.subject();
  service.activateAdapters([{
    name: 'DataWarehouse',
    config: {
      host: config.wnycAccountRoot,
      endpoint: 'api/v1/analytics/ga',
    }
  }, {
    name: 'GoogleAnalytics',
    config: {
      id: config.googleAnalyticsKey
    },
  }, {
    name: 'NprAnalytics',
    config: {
      id: config.nprGoogleAnalyticsKey
    }
  }]);
  let nprTrackPageSpy = this.spy(service._adapters.NprAnalytics, 'trackPage');
  let nprTrackEventSpy = this.spy(service._adapters.NprAnalytics, 'trackEvent');
  
  let gaTrackPageSpy = this.spy(service._adapters.GoogleAnalytics, 'trackPage');
  let gaTrackEventSpy = this.spy(service._adapters.GoogleAnalytics, 'trackEvent');
  
  // use a stub so DW doesn't do stuff we don't want
  let dwTrackPageSpy = this.stub(service._adapters.DataWarehouse, 'trackPage');
  let dwTrackEventSpy = this.stub(service._adapters.DataWarehouse, 'trackEvent');
  
  service.trackPage({ page: '/foo', title: 'foo' });
  
  assert.notOk(nprTrackPageSpy.returnValue, 'npr trackPage should not be called');
  assert.equal(gaTrackPageSpy.callCount, 1, 'ga trackPage should be called');
  assert.equal(dwTrackPageSpy.callCount, 1, 'dw trackPage should be called');
  
  service.trackEvent({ category: 'foo', action: 'bar', label: 'baz' });
  
  assert.notOk(nprTrackEventSpy.returnValue, 'npr trackEvent should not be called');
  assert.equal(gaTrackEventSpy.callCount, 1, 'ga trackEvent should be called');
  assert.equal(dwTrackEventSpy.callCount, 1, 'dw trackEvent should be called');
});
