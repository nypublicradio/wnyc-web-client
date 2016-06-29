import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wnyc-svg', 'Integration | Component | wnyc svg', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wnyc-svg}}`);

  assert.equal(this.$().text().trim(), '', 'it renders without error if no icon is set');
});
