import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('listen-button', 'Integration | Component | listen button', {
  integration: true
});

let MockAudio = function() {
  this.playCount = 0;
  this.lastPlayed = null;
  this.lastContext = null;
  this.isReady = true;
};

MockAudio.prototype.play = function(id, context) {
  this.playCount += 1;
  this.lastPlayed = id;
  this.lastContext = context;
};

test('it renders', function(assert) {
  this.render(hbs`{{listen-button}}`);
  assert.equal(this.$('button').length, 1);
});

test('it calls play on audio', function(assert) {
  let mockAudio = new MockAudio();
  this.set('audio', mockAudio);
  this.set('itemPK', 'test-pk');
  this.set('playContext', 'test-context');
  this.render(hbs`{{listen-button audio=audio itemPK=itemPK playContext=playContext}}`);

  this.$('button').click();

  assert.equal(mockAudio.playCount, 1, 'it should call play one time');
  assert.strictEqual(mockAudio.lastPlayed, 'test-pk', 'it should pass the itemPK');
  assert.strictEqual(mockAudio.lastContext, 'test-context', 'it should pass the context');
});
