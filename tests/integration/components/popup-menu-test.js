import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('popup-menu', 'Integration | Component | popup menu', {
  integration: true,
  beforeEach() {
    this.set('links', [{
      text: "Facebook",
      href:  `https:\/\/www.facebook.com/`,
      target: '_blank'
    },{
      text: "Twitter",
      href: `https:\/\/twitter.com/`,
      target: '_blank'
    }]);
  }
});

let initAndOpenPopup = function(context) {
  context.render(hbs`
    {{#popup-menu links=links}}
      Select A Link
    {{/popup-menu}}
    <div id="dummy">outside of the popup</div>
  `);
  context.$('.popupmenu-button')[0].click();
};

let isOpen = function(context) {
  return context.$('.popupmenu').hasClass('is-open');
};

let isClosed = function(context) {
  return !isOpen(context);
};

test('it renders', function(assert) {
  this.render(hbs`
    {{#popup-menu links=links}}
      Select A Link
    {{/popup-menu}}
  `);
  assert.equal(this.$('button').text().trim(), 'Select A Link');
  assert.equal(this.$('a').size(), 2);
});

test('it toggles the popup when you click the button', function(assert) {
  this.render(hbs`
    {{#popup-menu links=links}}
      Select A Link
    {{/popup-menu}}
  `);

  assert.ok(isClosed(this), 'popup begins closed');

  this.$('.popupmenu-button')[0].click();
  assert.ok(isOpen(this), 'popup opens');

  this.$('.popupmenu-button')[0].click();
  assert.ok(isClosed(this), 'popup closes');
});

test('it closes the popup when you click outside', function(assert) {
  initAndOpenPopup(this);
  this.$('#dummy')[0].click();
  assert.ok(isClosed(this), 'popup closes');
});

test('it does not close the popup when you click on the bubble', function(assert) {
  initAndOpenPopup(this);
  this.$('.popupmenu-popup')[0].click();
  assert.ok(isOpen(this), 'popup stays open');
});

test('it closes the popup when you click a link', function(assert) {
  assert.expect(2);
  initAndOpenPopup(this);

  $(window).on('click', function(e) {
    assert.ok(e.target.href, 'looks like it\'s going to open a link');
  });

  this.$('.popupmenu-listitem a')[0].click();
  assert.ok(isClosed(this), 'popup closes');
});
