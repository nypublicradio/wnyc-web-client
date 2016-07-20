import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/timelabel', 'Integration | Component | persistent player/timelabel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{persistent-player/timelabel}}`);

  assert.ok(this.$('.timelabel-position').length, 'position should exist');
  assert.ok(this.$('.timelabel-separator').length, 'separator should exist');
  assert.ok(this.$('.timelabel-total').length, 'total should exist');
});

test('it displays the correct timestamps', function(assert) {
  this.set('position', 5 * 1000);
  this.set('duration', 5 * 60 * 60 * 1000);
  this.render(hbs`{{persistent-player/timelabel position=position duration=duration}}`);

  const expectedPosition = '0:05';
  const expectedTotal = '5:00:00';
  assert.equal(this.$('.timelabel-position').text(), expectedPosition, 'position should be correct');
  assert.equal(this.$('.timelabel-total').text(), expectedTotal, 'total should be correct');
});

