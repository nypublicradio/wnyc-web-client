import { test } from 'qunit';
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
