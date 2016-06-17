import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-show', 'Integration | Component | discover show', {
  integration: true
});

test('it renders unchecked', function(assert) {
  this.set('title', 'Show Title');
  this.set('isSelected', false);
  this.render(hbs`{{discover-show title=title isSelected=isSelected}}`);

  assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
});

test('it renders checked', function(assert) {
  this.set('title', 'Show Title');
  this.set('isSelected', true);
  this.render(hbs`{{discover-show title=title isSelected=isSelected}}`);

  assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
});

test('unchecking and checking box will change attribute', function(assert) {
  this.set('isSelected', false);
  this.render(hbs`{{discover-show title=title isSelected=isSelected}}`);

  this.$('input[type=checkbox]').click();
  assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
  assert.equal(this.get('isSelected'), true);

  this.$('input[type=checkbox]').click();
  assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
  assert.equal(this.get('isSelected'), false);
});

test('when checked element has correct class', function(assert) {
  this.set('isSelected', false);
  this.render(hbs`{{discover-show isSelected=isSelected}}`);
  assert.equal(this.$('.discover-show').hasClass('is-selected'), false);

  this.set('isSelected', true);
  assert.equal(this.$('.discover-show').hasClass('is-selected'), true);
});
