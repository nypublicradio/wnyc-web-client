import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import config from 'overhaul/config/environment';

moduleForAcceptance('Acceptance | Analytics', {
  beforeEach() {
    Ember.$.Velocity.mock = true;  
  },
  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('it does not log a pageview when opening the queue', function(assert) {
  assert.expect(2);
  let done = assert.async();
  
  server.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, (schema, {queryParams}) => {
    if (queryParams.category === '_trackPageView') {
      assert.ok(true, 'trackPageView was called');
      done();
    }
    return true;
  });

  server.create('django-page', {id: '/'});
  visit('/');
  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 1, 'modal is open');
    click('.floating-queuebutton');
    return wait();
  });
});
