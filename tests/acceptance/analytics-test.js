import Ember from 'ember';
import Service from 'ember-service';
import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';

let analyticsStub;

moduleForAcceptance('Acceptance | Analytics', {
  beforeEach() {
    analyticsStub = Service.extend();
    this.application.register('service:analyticsStub', analyticsStub);
    this.application.inject('router:main', 'metrics', 'service:analyticsStub');
  },
});

test('it does not log a pageview when opening the queue', function(assert) {
  Ember.$.Velocity.mock = true;
  let counter = 0;

  analyticsStub.reopen({
    trackPage() {
      counter++;
    }
  });

  let home = server.create('django-page', {id: '/'});
  djangoPage
    .bootstrap(home)
    .visit(home);
  
  andThen(() => {
    click('.floating-queuebutton');
  });

  andThen(() => {
    assert.equal(find('.l-sliding-modal').length, 1, 'modal is open');
    click('.floating-queuebutton');
  });
  andThen(() => {
    assert.equal(counter, 1, 'only opened once');
  });
});
