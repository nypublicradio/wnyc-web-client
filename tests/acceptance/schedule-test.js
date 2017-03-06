import { skip } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import moment from 'moment';

moduleForAcceptance('Acceptance | schedule', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});
  visit('/schedule');

  andThen(function() {
    // ember strips the trailing slash
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });
});

test('clicking on /schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: 'fake/'});
  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});

  visit('/fake');

  andThen(function() {
    click('a[href="/schedule"]');
  });

  andThen(function() {
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });
});

skip('transitioning to a specific schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {
    id: '/streams',
    testMarkup: `
    <a href="/schedule/?scheduleStation=wqxr" id="foo">foo</a>
    `
  });
  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});

  visit('/streams');
  click('#foo');

  andThen(function() {
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });
});

test('schedule routes do dfp targeting', function(/*assert*/) {
  this.mock(this.application.__container__.lookup('route:schedule.date').get('googleAds'))
    .expects('doTargeting')
    .once();
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});

  visit('/schedule');
});
