import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import moment from 'moment';

module('Acceptance | schedule', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});
    await visit('/schedule');

    // ember strips the trailing slash
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
    assert.equal(findAll('#leaderboard').length, 1, 'leaderboard is present');
  });

  test('clicking on /schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: 'fake/'});
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});

    await visit('/fake');

    await click('a[href="/schedule"]');

    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });

  skip('transitioning to a specific schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {
      id: '/streams',
      testMarkup: `
      <a href="/schedule/?scheduleStation=wqxr" id="foo">foo</a>
      `
    });
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});

    await visit('/streams');
    await click('#foo');

    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });

  test('schedule routes do dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    await visit('/');
    this.mock(this.application.__container__.lookup('route:schedule.date').get('googleAds'))
      .expects('doTargeting')
      .once();
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});

    await visit('/schedule');
  });
});
