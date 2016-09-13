import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/notification', 'Integration | Component | persistent player/notification', {
  integration: true
});

test('it renders', function(assert) {
  this.set('preferredStream', 'WNYC 93.9FM');
  this.on('dismiss', function() {
    assert.equal(this.$('.player-notification').length, 0);
  });


  this.render(hbs`{{persistent-player.notification preferredStream=preferredStream}}`);
  let actualText = this.$('.player-notification p').text().trim();
  let expectedText = 'Your episode is over. In 15 seconds, we\'ll tune you to WNYC 93.9FM.';
  assert.equal(actualText, expectedText);

  this.set('secondsRemaining', 0);
  this.render(hbs`{{persistent-player.notification secondsRemaining=secondsRemaining preferredStream=preferredStream}}`);

  let actualElapsedText = this.$('.player-notification p').text().trim();
  let expectedElapsedText = 'We tuned you to WNYC 93.9FM after your episode ended.';
  assert.equal(actualElapsedText, expectedElapsedText);
});
