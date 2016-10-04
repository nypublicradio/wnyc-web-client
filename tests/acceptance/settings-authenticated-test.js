import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import {
  authenticateSession,
  currentSession,
} from 'overhaul/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | settings', {
  beforeEach() {
    authenticateSession(this.application);
    let session = currentSession(this.application);
    session.set('data.user-prefs-active-stream', 'wqxr');
    session.set('data.user-prefs-active-autoplay', 'default_stream');
  }
});

test('visiting /settings and selecting my queue as an autoplay preference', function(assert) {
  visit('/settings');

  click('.autoplay-options .ember-power-select-trigger');
  click('.autoplay-options .ember-power-select-option:last');

  andThen(function() {
    assert.equal(currentURL(), '/settings');

    var actualStream = $('.user-stream .ember-power-select-selected-item').text().trim();
    var expectedStream = 'WQXR New York';
    assert.equal(actualStream, expectedStream);

    var actualPref = $('.autoplay-options .ember-power-select-selected-item').text().trim();
    var expectedPref = 'My Queue';
    assert.equal(actualPref, expectedPref);
  });
});

test('after visiting settings, user can select different stream', function(assert) {
  visit('/settings');

  click('.user-stream .ember-power-select-trigger').then(() => {
    click('.user-stream .ember-power-select-option:eq(2)');
  });

  andThen(function() {
    var actualStream = $('.user-stream .ember-power-select-selected-item').text().trim();
    var expectedStream = 'WNYC 93.9FM';
    assert.equal(actualStream, expectedStream);
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
