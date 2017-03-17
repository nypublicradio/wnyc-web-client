import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | playlist');

test('visiting /streams/wnyc-fm939', function(assert) {
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

  andThen(function() {
    assert.equal(currentURL(), '/streams/wnyc-fm939');
    assert.equal(find('a[href="http://fooshow.com"]').text().trim(), 'Episode Foo');
  });
});
