import { findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | archived-shows', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /archived-shows', async function(assert) {
    server.createList('show', 25);
    await visit('/archived-shows');

    assert.equal(currentURL(), '/archived-shows');

    //all 25 shows are listed, per test data
    assert.equal( findAll('.shows-list ul li').length, 25, "twenty five shows are listed" );
  });
});
