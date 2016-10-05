import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import config from 'overhaul/config/environment';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | Analytics', {
  beforeEach() {
    Ember.$.Velocity.mock = true;
  },
  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('it does not log a pageview when opening and closing the queue', function(assert) {
  assert.expect(4);
  let done = assert.async();
  var pageViewEvent = sinon.spy();

  server.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, (schema, {queryParams}) => {
    if (queryParams.category === '_trackPageView') {
      pageViewEvent(queryParams);
    }
    return wait();
  });

  server.create('django-page', {id: '/'});
  visit('/');
  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 1, 'modal is open');
    assert.ok(pageViewEvent.calledOnce, 'trackpageViewEvent was only called once after opening queue');
  });

  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 0, 'modal is closed');
    assert.ok(pageViewEvent.calledOnce, 'trackPageView was only called once after opening and closing queue');
    done();
  });
});

