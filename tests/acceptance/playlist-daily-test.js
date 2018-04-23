import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import moment from 'moment';

module('Acceptance | playlist daily', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /playlist-daily', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});
    await visit('/playlist-daily');

    // ember strips the trailing slash
    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
    assert.equal(findAll('#leaderboard').length, 1, 'leaderboard should be present');
  });

  test('clicking on /playlist-daily', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: 'fake/'});
    server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});

    await visit('/fake');

    await click('a[href="/playlist-daily"]');

    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
  });

  test('transitioning to a specific schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {
      id: 'fake/',
      testMarkup: `
      <a href="/playlist-daily/?scheduleStation=wqxr" id="foo">foo</a>
      `
    });
    server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});

    await visit('/fake');
    await click('#foo');

    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
  });
});
