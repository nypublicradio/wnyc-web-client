import { currentURL, find, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

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

    await visit('/streams/wnyc-fm939');

    assert.equal(currentURL(), '/streams/wnyc-fm939');
    assert.equal(find('a[href="http://fooshow.com"]').textContent.trim(), 'Episode Foo');
  });

  test('playlist routes do dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'foo/'});
    await visit('/foo');
    
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
    
    this.mock(this.application.__container__.lookup('route:playlist').get('googleAds'))
      .expects('doTargeting')
      .once();

    await visit('/streams/wnyc-fm939');
  });
});
