import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('playlist-play-indicator', 'Integration | Component | playlist play indicator', {
  integration: true,

  beforeEach: function () {
    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });
  }
});

const audioStub = Ember.Service.extend({
  isReady: false,
  currentAudio: {id: 'audioPK'},
  isPlaying: false
});

test('it renders', function(assert) {
  this.render(hbs`{{playlist-play-indicator}}`);
  assert.equal(this.$('button').length, 1);
});

test('play button is disabled when audio is not ready', function(assert) {
  this.set('itemPK', 'audioPK');
  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('button').is(":disabled"), true);
});

test('play button is enabled when audio is ready', function(assert) {
  this.set('audio.isReady', true);
  this.set('itemPK', 'audioPK');

  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('button').is(":disabled"), false);
});

test('has is-playing class when audio is playing and audio is current', function(assert) {
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', true);
  this.set('itemPK', 'audioPK');

  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('[data-is-playing]').length, 1);
});

test('does not have data-is-playing attribute when audio is not playing', function(assert) {
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', false);
  this.set('itemPK', 'audioPK');

  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('[data-is-playing]').length, 0);
});

test('does not have data-is-playing attribute when audio is not current', function(assert) {
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', true);
  this.set('itemPK', 'blah');

  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('[data-is-playing]').length, 0);
});

test('has data-is-current attribute when data is current', function(assert) {
  this.set('audio.isReady', true);
  this.set('audio.isPlaying', true);
  this.set('itemPK', 'audioPK');

  this.render(hbs`{{playlist-play-indicator itemPK=itemPK}}`);
  assert.equal(this.$('[data-is-current]').length, 0);
});
