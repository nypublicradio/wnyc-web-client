import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | playlist');

test('visiting /streams/wqxr', function(assert) {
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
  
  visit('/streams/wqxr');

  andThen(function() {
    assert.equal(currentURL(), '/streams/wqxr');
    assert.equal(find('a[href="http://fooshow.com"]').text().trim(), 'Episode Foo');
  });
});

test('playlist routes do dfp targeting', function(/*assert*/) {
  this.mock(this.application.__container__.lookup('route:playlist').get('googleAds'))
    .expects('doTargeting')
    .once();
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

  visit('/streams/wnyc-fm939');
});
