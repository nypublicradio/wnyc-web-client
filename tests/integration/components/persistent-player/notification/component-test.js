import { moduleForComponent, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const sessionStub = Ember.Service.extend({
  data: {
    'user-prefs-active-stream': 'wnyc-fm939',
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
    currentContext: 'continuous-play-bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position currentContext=currentContext}}`);

  let actualText = this.$('.player-notification p').text().trim().replace(/\s{2,}/, '');
  let expectedText = 'Your episode is over. In 15 seconds,we\'ll tune you to .';
  assert.equal(actualText, expectedText);
});

test('it renders after the bumper duration countdown', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  this.setProperties({
    duration: 15000,
    position: 15500,
    currentContext: 'continuous-play-bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position currentContext=currentContext}}`);

  // this kind of makes me NEVER want to split up text with conditional values at all in handlebars
  let text = this.$('.player-notification p').text().trim();
  let actualElapsedText = text.replace(/\n/, '').split(/\s{2,}/).join(' ');
  let expectedElapsedText = 'We tuned you to after your episode ended.';
  assert.equal(actualElapsedText, expectedElapsedText);
});
