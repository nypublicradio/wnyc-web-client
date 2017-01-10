import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { faker } from 'ember-cli-mirage';
import moment from 'moment';

moduleForAcceptance('Acceptance | schedule');


test('visiting /schedule redirects to todays schedule url', function(assert) {
  server.createList('schedule', 10);
  const date = moment().tz('America/New_York').format('YYYY/MMM/DD').toLowerCase();

  visit('/schedule');

  andThen(function() {
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });
});

test('visiting arbitrary /schedule/[date] w/o query string returns schedule', function(assert) {
  server.createList('schedule', 10);
  const date = faker.date.past();

  // Index from split e.g. "Tue Oct 11 2016"
  const year = date.toDateString().split(' ')[3]; // 2016
  const month = date.toDateString().split(' ')[1].toLowerCase(); // oct
  const day = date.toDateString().split(' ')[2]; // 11

  visit(`/schedule/${year}/${month}/${day}/`);

  andThen(function() {
    assert.equal(currentURL(), `/schedule/${year}/${month}/${day}/`);
  });
});

test('clicking on /schedule', function(assert) {
  server.createList('schedule', 10);

  const date = moment().tz('America/New_York').format('YYYY/MMM/DD').toLowerCase();

  visit('/');

  andThen(function() {
    click('a[href="/schedule"]');
  });

  andThen(function() {
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });
});

test('navigating to yesterday and displaying data', function(assert) {
  server.createList('schedule', 10);

  const dateAsMoment = moment().tz('America/New_York');
  const yesterday = dateAsMoment.subtract(1, 'day').format('YYYY/MMM/DD').toLowerCase();

  visit('/schedule');
  click('li.yesterday a');

  andThen(() => {
    const scheduleEvents = find('ul.schedule-table div.event');
    assert.equal(currentURL(), `/schedule/${yesterday}?scheduleStation=wnyc-fm939`);
    assert.equal(scheduleEvents.length, 10);
  });
});

test('navigating to tomorrow and displaying data', function(assert) {
  server.createList('schedule', 10);

  const dateAsMoment = moment().tz('America/New_York');
  const tomorrow = dateAsMoment.add(1, 'day').format('YYYY/MMM/DD').toLowerCase();

  visit('/schedule');
  click('li.tomorrow a');

  andThen(() => {
    const scheduleEvents = find('ul.schedule-table div.event');
    assert.equal(currentURL(), `/schedule/${tomorrow}?scheduleStation=wnyc-fm939`);
    assert.equal(scheduleEvents.length, 10);
  });
});

test('navigating to all streams', function(assert) {
  server.createList('schedule', 10);
  visit('/schedule/2016/jan/01?scheduleStation=wnyc-fm939');

  let stationList = ['wnyc-fm939', 'wnyc-am820', 'njpr',
                 'special-events-stream', 'jonathan-channel'];

  stationList.forEach((link) => {
    click(`a[href="?scheduleStation=${link}"]`);
    andThen(() => {
      assert.equal(currentURL(), `/schedule/2016/jan/01?scheduleStation=${link}`);
    });
  });
});

test('frontend displays all items', function(assert) {
  server.createList('schedule', 15);

  visit('/schedule');

  andThen(() => {
    const scheduleEvents = find('ul.schedule-table div.event');
    assert.equal(scheduleEvents.length, 15);
  });
});

