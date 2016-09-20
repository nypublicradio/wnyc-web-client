import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import moment from 'moment';

moduleForAcceptance('Acceptance | schedule');

test('visiting /schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});
  visit('/schedule');

  andThen(function() {
    // ember strips the trailing slash
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });
});

test('clicking on /schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: '/'});
  server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});
  
  visit('/');
  
  andThen(function() {
    click('a[href="/schedule"]');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });
});
