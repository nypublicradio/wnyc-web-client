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
  analyticsStub.reopen({
    trackPage() {
      assert.ok(true, 'trackPage was called');
    }
  });
  assert.expect(1);

  server.create('django-page', {id: '/'});
  visit('/');
  click('.floating-queuebutton');
});
