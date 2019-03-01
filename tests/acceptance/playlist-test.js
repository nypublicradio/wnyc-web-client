import { currentURL, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';
import moment from 'moment';

module('Acceptance | playlist', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /streams/wnyc-fm939', async function(assert) {
    server.create('stream', {
      slug: 'wnyc-fm939',
      name: 'WNYC FM',
    });
    server.create('whats-on', {
      slug: 'wnyc-fm939',
      current_show: {
        show_title: 'Foo Show',
        title: 'Episode Foo',
        url: 'http://fooshow.com',
        end: "2016-09-15T13:00:15.542Z" // 9 am
      }
    });
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wnyc-fm939`});

    await visit('/streams/wnyc-fm939');
    assert.equal(currentURL(), `/playlist-daily/${date}`);
  });
});
