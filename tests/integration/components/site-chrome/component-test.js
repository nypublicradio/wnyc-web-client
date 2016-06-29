import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-chrome', 'Integration | Component | site chrome', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{site-chrome}}`);

  assert.equal(this.$('.l-page').length, 1);

  // Template block usage:
  this.render(hbs`
    {{#site-chrome}}
      template block text
    {{/site-chrome}}
  `);

  assert.ok(this.$().text().trim().match('template block text'));
});
