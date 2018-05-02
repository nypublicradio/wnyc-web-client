import { find, click, findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';
//import 'wqxr-web-client/tests/helpers/with-feature';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('user');
    authenticateSession({access_token: 'foo'});

    let session = currentSession();
    session.set('data.user-prefs-active-stream', {slug: 'wqxr', name: 'WQXR 105.9 FM'});
    session.set('data.user-prefs-active-autoplay', 'default_stream');
    server.createList('stream', 7);
  });


  test('after visiting settings, user can select different stream', async function(assert) {
    let stream = server.schema.streams.all().models[2];
    await visit('/settings');

    await click('.user-stream .ember-power-select-trigger')
    await click('.user-stream .ember-power-select-option:nth-child(3)');

    var actualStream = find('.user-stream .ember-power-select-selected-item').textContent.trim();
    assert.equal(actualStream, stream.name);
  });

  test('the stream button in the nav should match the default stream', async function(assert) {
    await visit('/settings');

    const actualLabel = (find('.stream-launcher') || find('.sitechrome-nav .listen-button')).getAttribute('aria-label');
    const expectedLabel = 'Listen to WQXR 105.9 FM';
    assert.equal(actualLabel, expectedLabel);
  });

  test('after visiting settings, user can toggle off autoplay settings', async function(assert) {
    await visit('/settings');

    await click('.toggle');
    var expectedElementCount = findAll('.inactive-toggle').length;
    var actualElementCount = 1;
    assert.equal(expectedElementCount, actualElementCount);
  });
});
