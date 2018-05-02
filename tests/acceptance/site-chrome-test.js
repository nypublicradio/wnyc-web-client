import { findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | site-chrome', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting / results in the nav-homepage class on the site chrome', async function(assert) {
    server.create('djangoPage', {id:'/'});

    await visit('/');

    assert.equal(findAll('.sitechrome-nav.nav--homepage').length, 1);
  });

  test('visiting /shows does not result in the nav-homepage class on the site chrome', async function(assert) {
    server.create('djangoPage', {id: 'story/foo/'});

    await visit('/story/foo');

    assert.equal(findAll('.sitechrome-nav.nav--homepage').length, 0);
  });
});
