import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('embedded-listen-button', 'Integration | Component | embedded listen button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{listen-button.embedded}}`);

  assert.equal(this.$().text().trim(), 'Play/Pause');
});
