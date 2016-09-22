import { moduleForComponent, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/notification', 'Integration | Component | persistent player/notification', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },

  afterEach() {
    window.server.shutdown();
  }
});

test('it renders with the bumper duration countdown', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM' });
  this.setProperties({
    duration: 15000,
    position: 0,
    currentContext: 'continuous-player-bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position currentContext=currentContext}}`);

  let actualText = this.$('.player-notification p').text().trim();
  let expectedText = 'Your episode is over. In 15 seconds, we\'ll tune you to .';
  assert.equal(actualText, expectedText);
});

test('it renders after the bumper duration countdown', function(assert) {
  server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM' });
  this.setProperties({
    duration: 15000,
    position: 15500,
    currentContext: 'continuous-player-bumper'
  });

  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });

  this.render(hbs`{{persistent-player.notification duration=duration position=position currentContext=currentContext}}`);

  let actualElapsedText = this.$('.player-notification p').text().trim();
  let expectedElapsedText = 'We tuned you to  after your episode ended.';
  assert.equal(actualElapsedText, expectedElapsedText);
});
