import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | archived-shows');

test('visiting /archived-shows', function(assert) {
  server.createList('show', 25);
  visit('/archived-shows');

  andThen(function() {
    assert.equal(currentURL(), '/archived-shows');

    //all 25 shows are listed, per test data
    assert.equal( $('.shows-list ul li').length, 25, "twenty five shows are listed" );

  });
});
