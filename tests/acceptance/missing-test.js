import { findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | missing', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /missing', async function(assert) {
    await visit('/missing');

    assert.equal(currentURL(), '/missing');
    assert.equal(findAll('.error-img').length, 1);
  });
});
