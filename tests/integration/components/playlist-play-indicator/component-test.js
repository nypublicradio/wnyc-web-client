import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('playlist-play-indicator', 'Integration | Component | playlist play indicator', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{playlist-play-indicator}}`);
  assert.equal(this.$('button').length, 1);
});

test('play button is disabled when audio is not ready', function(assert) {
  this.render(hbs`{{playlist-play-indicator isReady=false}}`);
  assert.equal(this.$('button').is(":disabled"), true);
});

test('play button is enabled when audio is ready', function(assert) {
  this.render(hbs`{{playlist-play-indicator isReady=true}}`);
  assert.equal(this.$('button').is(":disabled"), false);
});

test('has data-is-playing attribute when audio is playing', function(assert) {
  this.render(hbs`{{playlist-play-indicator isPlaying=true}}`);
  assert.equal(this.$('[data-is-playing]').length, 1);
});

test('does not have data-is-playing attribute when audio is not playing', function(assert) {
  this.render(hbs`{{playlist-play-indicator isPlaying=false}}`);
  assert.equal(this.$('[data-is-playing]').length, 1);
});

test('sends pause action on click when playing', function(assert) {
  assert.expect(1);

  this.set('actionFired', false);
  this.set('onPause', () => {
    this.set('actionFired', true);
  });

  this.render(hbs`{{playlist-play-indicator isReady=true isPlaying=true onPause=(action onPause)}}`);
  this.$('button').click();

  return wait().then(() => {
    assert.equal(this.get('actionFired'), true, "pause action should have fired");
  });
});

test('sends play action on click when paused', function(assert) {
  assert.expect(1);

  this.set('actionFired', false);
  this.set('onPlay', () => {
    this.set('actionFired', true);
  });

  this.render(hbs`{{playlist-play-indicator isReady=true isPlaying=false onPlay=(action onPlay)}}`);
  this.$('button').click();

  return wait().then(() => {
    assert.equal(this.get('actionFired'), true, "play action should have fired");
  });
});

test('sends no action on click when not ready', function(assert) {
  this.set('actionFired', false);
  this.set('onPlay', () => {
    this.set('actionFired', true);
  });

  this.set('onPause', () => {
    this.set('actionFired', true);
  });

  this.render(hbs`{{playlist-play-indicator isReady=false isPlaying=true onPause=(action onPause) onPlay=(action onPlay)}}`);

  this.$('button').click();

  return wait().then(() => {
    assert.equal(this.get('actionFired'), false, "no action should have fired");
  });
});
