import { findAll, currentURL, find, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | playlist', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /streams/wqxr', async function(assert) {
    server.create('stream', {
      slug: 'wqxr',
      name: 'WQXR FM',
    });
    server.create('whats-on', {
      slug: 'wqxr',
      current_show: {
        show_title: 'Foo Show',
        title: 'Episode Foo',
        url: 'http://fooshow.com',
        end: "2016-09-15T13:00:15.542Z" // 9 am
      }
    });

    await visit('/streams/wqxr');

    assert.equal(currentURL(), '/streams/wqxr');
    assert.equal(find('a[href="http://fooshow.com"]').textContent.trim(), 'Episode Foo');
    assert.equal(findAll('#leaderboard').length, 1, 'leaderboard is present');
    assert.equal(findAll('#rightRail').length, 1, 'sidebar ad is present');
  });

  test('playlist routes do dfp targeting', async function() /*assert*/{
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

    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    await visit('/');
    this.mock(this.owner.lookup('route:playlist').get('googleAds'))
      .expects('doTargeting')
      .once();

    await visit('/streams/wnyc-fm939');
  });
});
