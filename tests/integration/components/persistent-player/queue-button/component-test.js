import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/queue-button', 'Integration | Component | persistent queuebutton', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{persistent-player/queue-button}}`);
  const expected = 'Queue';
  let actual = this.$().text().trim();
  assert.equal(actual, expected);
});

test('it calls the external showModal action', function(assert) {
  function externalAction(which) {
    assert.ok('it was called');
    assert.equal(which, 'queue-history', 'the proper modal name is passed');
  }

  this.set('externalAction', externalAction);
  this.render(hbs`{{persistent-player/queue-button showModal=externalAction}}`);
  this.$('.persistent-queuebutton').click();
});

test('it calls the external closeModal action', function(assert) {
  function externalAction() {
    assert.ok('it was called');
  }

  this.set('externalAction', externalAction);
  this.set('isOpenModal', true);
  this.render(hbs`{{persistent-player/queue-button isOpenModal=isOpenModal closeModal=externalAction}}`);
  this.$('.persistent-queuebutton').click();
});

test('it adds an animate class if the queuelength is increased', function(assert) {
  this.set('queueLength', 0);
  this.render(hbs`{{persistent-player/queue-button queueLength=queueLength}}`);
  assert.notOk(this.$('.persistent-queuebutton').hasClass('animate'), 'no animate class at start');
  this.set('queueLength', 1);
  assert.ok(this.$('.persistent-queuebutton').hasClass('animate'), 'animate class is added');
});
