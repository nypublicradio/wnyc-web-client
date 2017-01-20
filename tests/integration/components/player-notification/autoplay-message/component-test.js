import { moduleForComponent, test } from 'ember-qunit';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const sessionStub = Ember.Service.extend({
  data: {
    'user-prefs-active-stream': {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
    'user-prefs-active-autoplay': 'default_stream'
  }
});

moduleForComponent('player-notification/autoplay-message', 'Integration | Component | player notification/autoplay message', {
  integration: true,
  beforeEach() {
    this.register('service:session', sessionStub);
    this.inject.service('session');
    startMirage(this.container);
  },

  afterEach() {
    window.server.shutdown();
  }
});

test('it renders with the bumper duration countdown with stream message if stream is enabled', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blergh' });
  this.setProperties({
    duration: 15000,
    position: 0,
    audioType: 'bumper',
    preferredStreamStub: {
      name: 'WNYC 93.9 FM'
    },
    streamEnabledStub: true
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{player-notification/autoplay-message preferredStream=preferredStreamStub streamEnabled=streamEnabledStub duration=duration position=position audioType=audioType}}`);

  let actualText = this.$().text().trim().replace(/\s{2,}/gm, ' ');
  let expectedText = 'Your episode is over. In 15 seconds, we\'ll tune you to WNYC 93.9 FM. Change Settings';
  assert.equal(actualText, expectedText);
});

test('it renders after the bumper duration countdown with stream message if stream is enabled', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  this.setProperties({
    duration: 15000,
    position: 15500,
    audioType: 'bumper',
    preferredStreamStub: {
      name: 'WNYC 93.9 FM'
    },
    streamEnabledStub: true
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{player-notification/autoplay-message preferredStream=preferredStreamStub streamEnabled=streamEnabledStub duration=duration position=position audioType=audioType}}`);

  let actualElapsedText = this.$().text().trim().replace(/\s{2,}/gm, ' ');
  let expectedElapsedText = 'We tuned you to WNYC 93.9 FM after your episode ended. Change Settings';
  assert.equal(actualElapsedText, expectedElapsedText);
});

test('it renders with the bumper duration countdown with queue message if stream is disabled', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blergh' });
  this.setProperties({
    duration: 15000,
    position: 0,
    audioType: 'bumper',
    preferredStreamStub: {
      name: 'WNYC 93.9 FM'
    },
    streamEnabledStub: false
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{player-notification/autoplay-message preferredStream=preferredStreamStub streamEnabled=streamEnabledStub duration=duration position=position audioType=audioType}}`);

  let actualText = this.$().text().trim().replace(/\s{2,}/gm, ' ');
  let expectedText = 'Your episode is over. In 15 seconds, your audio queue will begin to play. Change Settings';
  assert.equal(actualText, expectedText);
});

test('it renders after the bumper duration countdown with queue message if stream is disabled', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  this.setProperties({
    duration: 15000,
    position: 15500,
    audioType: 'bumper',
    preferredStreamStub: {
      name: 'WNYC 93.9 FM'
    },
    streamEnabledStub: false
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{player-notification/autoplay-message preferredStream=preferredStreamStub streamEnabled=streamEnabledStub duration=duration position=position audioType=audioType}}`);

  let actualElapsedText = this.$().text().trim().replace(/\s{2,}/gm, ' ');
  let expectedElapsedText = 'We began playing your audio queue after your episode ended. Change Settings';
  assert.equal(actualElapsedText, expectedElapsedText);
});
