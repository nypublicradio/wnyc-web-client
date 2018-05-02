import { click, currentURL, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import moment from 'moment';

import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | schedule', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});
    await visit('/schedule');

    // ember strips the trailing slash
    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });

  test('clicking on /schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: '/'});
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});

    await visit('/');

    await click('a[href="/schedule"]');

    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wnyc-fm939`);
  });

  test('transitioning to a specific schedule', async function(assert) {
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {
      id: '/',
      testMarkup: `
      <a href="/schedule/?scheduleStation=wqxr" id="foo">foo</a>
      `
    });
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wqxr`});

    await visit('/');
    await click('#foo');

    assert.equal(currentURL(), `/schedule/${date}?scheduleStation=wqxr`);
  });

  test('schedule routes do dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'foo/'});
    await visit('/foo');
    this.mock(this.owner.lookup('route:schedule.date').get('googleAds'))
      .expects('doTargeting')
      .once();

    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `schedule/${date}/?scheduleStation=wnyc-fm939`});

    await visit('/schedule');
  });
});
