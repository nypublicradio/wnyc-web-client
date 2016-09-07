import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('persistent-player/notification', 'Integration | Component | persistent player/notification', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{persistent-player/notification}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#persistent-player/notification}}
      template block text
    {{/persistent-player/notification}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
