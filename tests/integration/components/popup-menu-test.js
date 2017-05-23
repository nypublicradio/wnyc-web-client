import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('popup-menu', 'Integration | Component | popup menu', {
  integration: true,
});

let isOpen = function(context, selectorPrefix = '') {
  let selector = selectorPrefix + '.popupmenu';
  return context.$(selector).hasClass('is-open');
};

let isClosed = function(context, selectorPrefix) {
  return !isOpen(context, selectorPrefix);
};

test('it renders', function(assert) {
  this.render(hbs`
    {{#popup-menu text='Text'}}
      <div class='find-me'></div>
    {{/popup-menu}}
  `);
  assert.equal(this.$('.popupmenu-button').text().trim(), 'Text', 'button text should render');
  assert.equal(this.$('.find-me').length, 1, 'block contents should render');
});

test('it toggles the popup when you click the button', function(assert) {
  assert.expect(3);
  this.render(hbs`{{popup-menu}}`);
  assert.ok(isClosed(this), 'popup should begin closed');
  this.$('.popupmenu-button')[0].click();

  wait().then(() => {
    assert.ok(isOpen(this), 'popup should open after clicking the button');
    this.$('.popupmenu-button')[0].click();
  });

  return wait().then(() => {
    assert.ok(isClosed(this), 'popup should close after clicking the button again');
  });
});

test('it closes the popup when you click outside', function(assert) {
  assert.expect(1);
  this.render(hbs`{{popup-menu}} <div id="outside">outside</div>`);
  this.$('.popupmenu-button')[0].click();

  wait().then(() => {
    this.$('#outside')[0].click();
  });

  return wait().then(() => {
    assert.ok(isClosed(this), 'popup should close after clicking outside');
  });
});

test('it closes the popup when you send a close action', function(assert) {
  assert.expect(1);
  this.render(hbs`{{#popup-menu as |close|}} <button id="close" {{action close}}>close</button> {{/popup-menu}}`);
  this.$('.popupmenu-button')[0].click();

  wait().then(() => {
    this.$('#close')[0].click();
  });

  return wait().then(() => {
    assert.ok(isClosed(this), 'popup should close after clicking button with close action');
  });
});

test('it does not close the popup when you click on the bubble', function(assert) {
  assert.expect(1);
  this.render(hbs`{{popup-menu}}`);
  this.$('.popupmenu-button')[0].click();

  wait().then(() => {
    this.$('.popupmenu-popup')[0].click();
  });

  return wait().then(() => {
    assert.ok(isOpen(this), 'popup should remain open after clicking bubble');
  });
});

test('it works correctly with two buttons', function(assert) {
  assert.expect(6);
  this.render(hbs`
    {{#popup-menu class="b1" text="1"}}{{/popup-menu}}
    {{#popup-menu class="b2" text="2"}}{{/popup-menu}}
  `);
  assert.ok(isClosed(this, '.b1'), 'popup 1 should begin closed');
  assert.ok(isClosed(this, '.b2'), 'popup 2 should begin closed');

  this.$('.b1 .popupmenu-button')[0].click();

  wait().then(() => {
    assert.ok(isOpen(this, '.b1'), 'popup 1 should open after clicking button 1');
    assert.ok(isClosed(this, '.b2'), 'popup 2 should remain closed after clicking button 1');
    this.$('.b2 .popupmenu-button')[0].click();
  });

  return wait().then(() => {
    assert.ok(isClosed(this, '.b1'), 'popup 1 should close after clicking button 2');
    assert.ok(isOpen(this, '.b2'), 'popup 2 should open after clicking button 2');
  });

});
