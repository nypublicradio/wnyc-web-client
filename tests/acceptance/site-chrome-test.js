import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | site-chrome', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting / results in the nav-homepage class on the site chrome', function(assert) {
  server.create('djangoPage', {id:'/'});

  visit('/');

  andThen(function() {
    assert.equal(find('.sitechrome-nav.nav--homepage').length, 1);
  });
});

test('visiting /shows does not result in the nav-homepage class on the site chrome', function(assert) {
  server.create('djangoPage', {id: 'story/foo/'});

  visit('/story/foo');

  andThen(function() {
    assert.equal(find('.sitechrome-nav.nav--homepage').length, 0);
  });
});
