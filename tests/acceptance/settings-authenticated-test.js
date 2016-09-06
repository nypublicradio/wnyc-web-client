import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import {
  authenticateSession,
  currentSession,
  invalidateSession
} from 'overhaul/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | settings authenticated', {
  beforeEach() {
    authenticateSession(this.application);
    let session = currentSession(this.application);
    session.set('data.user-prefs-active-stream', 'wqxr');
    session.set('data.user-prefs-active-autoplay', 'no_autoplay');
  }
});

test('visiting /settings', function(assert) {
  visit('/settings');
  andThen(function() {
    assert.equal(currentURL(), '/settings');

    var actualStream = $('.user-stream .ember-power-select-selected-item').text().trim();
    var expectedStream = 'WQXR New York';
    assert.equal(actualStream, expectedStream);

    var actualPref = $('.autoplay-options .ember-power-select-selected-item').text().trim();
    var expectedPref = 'Do Not Autoplay';
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

test('after visiting settings, user can select different autoplay pref', function(assert) {
  visit('/settings');

  click('.toggle').then(() => {
    click('.autoplay-options .ember-power-select-trigger');
    click('.autoplay-options .ember-power-select-option:first');
  });

  andThen(function() {
    var actualPref = $('.autoplay-options .ember-power-select-selected-item').text().trim();
    var expectedPref = 'My Default Stream';
    assert.equal(actualPref, expectedPref);
  });
});

moduleForAcceptance('Acceptance | settings inauthenticated', {
  beforeEach() {
    invalidateSession(this.application);
    let session = currentSession(this.application);

    session.set('data.user-prefs-active-stream', null);
    session.set('data.user-prefs-active-autoplay', null);
  }
});

test('visiting /settings', function(assert) {
  visit('/settings');


  andThen(function() {
    assert.equal(currentURL(), '/settings');

    var expectedTagLength = 1;
    var actualTagLength = $('.user-settings p').length;
    assert.equal(expectedTagLength, actualTagLength);
  });
});
