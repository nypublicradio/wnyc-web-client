import Service from 'ember-service';
import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';

let analyticsStub;

moduleForAcceptance('Acceptance | Analytics', {
  beforeEach() {
    analyticsStub = Service.extend();
    this.application.register('service:analyticsStub', analyticsStub);
    this.application.inject('router:main', 'metrics', 'service:analyticsStub');
  }
});

test('it does not log a pageview when opening the queue', function(assert) {
  assert.expect(2);
  let done = assert.async();

  analyticsStub.reopen({
    trackPage() {
      assert.ok(true, 'trackPage was called');
      done();
    }
  });

  server.create('django-page', {id: '/'});
  visit('/');
  click('.floating-queuebutton');

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 1, 'modal is open');
    click('.floating-queuebutton');
  });
});
