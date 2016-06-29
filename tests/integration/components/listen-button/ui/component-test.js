import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('listen-button/ui', 'Integration | Component | listen button/ui', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{listen-button.ui}}`);

  assert.equal(this.$().text().trim(), 'Play/Pause');
});
