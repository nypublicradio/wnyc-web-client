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

moduleForComponent('persistent-player/notification', 'Integration | Component | persistent player/notification', {
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

test('it renders with the bumper duration countdown', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blergh' });
  this.setProperties({
    duration: 15000,
    position: 0,
    audioType: 'bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position audioType=audioType}}`);

  let actualText = this.$('.player-notification p').text().trim().replace(/\s{2,}/gm, ' ');
  let expectedText = 'Your episode is over. In 15 seconds, we\'ll tune you to . Change Settings';
  assert.equal(actualText, expectedText);
});

test('it renders after the bumper duration countdown', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  this.setProperties({
    duration: 15000,
    position: 15500,
    audioType: 'bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position audioType=audioType}}`);

  // this kind of makes me NEVER want to split up text with conditional values at all in handlebars
  let actualElapsedText = this.$('.player-notification p').text().trim().replace(/\s{2,}/gm, ' ');
  let expectedElapsedText = 'We tuned you to after your episode ended. Change Settings';
  assert.equal(actualElapsedText, expectedElapsedText);
});
