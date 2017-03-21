import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import {
  authenticateSession,
  currentSession
} from 'wqxr-web-client/tests/helpers/ember-simple-auth';
import 'wqxr-web-client/tests/helpers/with-feature';

moduleForAcceptance('Acceptance | settings', {
  beforeEach() {
    server.create('user');
    authenticateSession(this.application, {access_token: 'foo'});

    let session = currentSession(this.application);
    session.set('data.user-prefs-active-stream', {slug: 'wqxr', name: 'WQXR New York'});
    session.set('data.user-prefs-active-autoplay', 'default_stream');
    server.createList('stream', 7);
  }
});

test('visiting /settings and selecting my queue as an autoplay preference', function(assert) {
  let wqxrStream = server.schema.streams.where({slug: 'wqxr'}).models[0];
  visit('/settings');

  click('.autoplay-options .ember-power-select-trigger');
  click('.autoplay-options .ember-power-select-option:last');

  andThen(function() {
    assert.equal(currentURL(), '/settings');

    var actualStream = $('.user-stream .ember-power-select-selected-item').text().trim();
    assert.equal(actualStream, wqxrStream.name);

    var actualPref = $('.autoplay-options .ember-power-select-selected-item').text().trim();
    var expectedPref = 'My Queue';
    assert.equal(actualPref, expectedPref);
  });
});

test('after visiting settings, user can select different stream', function(assert) {
  let stream = server.schema.streams.all().models[1];
  visit('/settings');

  click('.user-stream .ember-power-select-trigger').then(() => {
    click('.user-stream .ember-power-select-option:eq(1)');
  });

  andThen(function() {
    var actualStream = $('.user-stream .ember-power-select-selected-item').text().trim();
    assert.equal(actualStream, stream.name);
  });
});

test('the stream button in the nav should match the default stream', function(assert) {
  visit('/settings');

  andThen(function() {
    const actualLabel = $('.stream-launcher').attr('aria-label');
    const expectedLabel = 'Listen to WQXR New York';
    assert.equal(actualLabel, expectedLabel);
  });
});

test('after visiting settings, user can toggle off autoplay settings', function(assert) {
  visit('/settings');

  click('.toggle');
  andThen(function() {
    var expectedElementCount = $('.autoplay-inactive').length;
    var actualElementCount = 1;
    assert.equal(expectedElementCount, actualElementCount);
  });
});
