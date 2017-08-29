import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | missing');

test('visiting /missing', function(assert) {
  visit('/missing');

  andThen(function() {
    assert.equal(currentURL(), '/missing');
    assert.equal(find('.error-img').length, 1);
  });
});
