import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('queue-button', 'Integration | Component | queue button', {
  integration: true, 
  beforeEach() {
    const audioStub = Ember.Service.extend({
      isReady: true,
      queue: {
        items: []
      },
    });

    this.register('service:audio', audioStub);
    this.inject.service('audio', { as: 'audio' });
  },
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{queue-button}}`);

  assert.equal(this.$().text().trim(), 'Queue');
});

test('queue button "unqueued" state', function(assert) {
  this.set('audio.addToQueue', () => assert.ok('calls addToQueue on click'));

  this.render(hbs`{{queue-button}}`);

  assert.equal(this.$('button').attr('data-state'), undefined);

  this.$('button').click();
});

test('queue button "queued" state', function(assert) {
  this.set('audio.removeFromQueue', () => assert.ok('calls removeFromQueue on click'));

  this.render(hbs`{{queue-button inQueue=true}}`);

  assert.equal(this.$('button').attr('data-state'), 'in-queue');

  this.$('button').click();
});

test('queue buttons inQueue prop updates', function(assert) {

  this.render(hbs`{{queue-button itemPK=1}}`);
  assert.equal(this.$('button').attr('data-state'), undefined);

  Ember.run(() => {
    this.get('audio.queue.items').pushObject({id: 1});
  });
  Ember.run(() => {
    assert.equal(this.$('button').attr('data-state'), 'in-queue');
  });
});
