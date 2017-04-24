import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | playlist daily', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /playlist-daily', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});
  visit('/playlist-daily');

  andThen(function() {
    // ember strips the trailing slash
    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
    assert.equal(find('#leaderboard').length, 1, 'leaderboard should be present');
  });
});

test('clicking on /playlist-daily', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {id: 'fake/'});
  server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});

  visit('/fake');

  andThen(function() {
    click('a[href="/playlist-daily"]');
  });

  andThen(function() {
    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
  });
});

test('transitioning to a specific schedule', function(assert) {
  let date = moment().format('YYYY/MMM/DD').toLowerCase();
  server.create('django-page', {
    id: 'fake/',
    testMarkup: `
    <a href="/playlist-daily/?scheduleStation=wqxr" id="foo">foo</a>
    `
  });
  server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});

  visit('/fake');
  click('#foo');

  andThen(function() {
    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
  });
});
