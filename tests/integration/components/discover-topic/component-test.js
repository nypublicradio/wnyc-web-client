import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-topic', 'Integration | Component | discover topic', {
  integration: true
});

test('it renders unchecked', function(assert) {
  this.set('title', 'Music');
  this.set('url', 'm-u');
  this.set('isSelected', false);

  this.render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

  assert.equal(this.$('label').text().trim(), 'Music');
  assert.equal(this.$('input[type=checkbox]').attr('name'), 'm-u');
  assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
});

test('it renders checked', function(assert) {
  this.set('title', 'Music');
  this.set('url', 'm-u');
  this.set('isSelected', true);

  this.render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

  assert.equal(this.$('label').text().trim(), 'Music');
  assert.equal(this.$('input[type=checkbox]').attr('name'), 'm-u');
  assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
});

test('unchecking and checking box will change attribute', function(assert) {
  this.set('isSelected', false);
  this.render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);

  this.$('input[type=checkbox]').click();
  assert.equal(this.$('input[type=checkbox]').is(':checked'), true);
  assert.equal(this.get('isSelected'), true);

  this.$('input[type=checkbox]').click();
  assert.equal(this.$('input[type=checkbox]').is(':checked'), false);
  assert.equal(this.get('isSelected'), false);
});

test('when checked element has correct class', function(assert) {
  this.set('title', 'Music');
  this.set('url', 'm-u');
  this.set('isSelected', false);
  this.render(hbs`{{discover-topic title=title url=url isSelected=isSelected}}`);
  assert.equal(this.$('.discover-topic').hasClass('is-selected'), false);

  this.set('isSelected', true);
  assert.equal(this.$('.discover-topic').hasClass('is-selected'), true);
});
