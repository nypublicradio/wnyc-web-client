import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-callout', 'Integration | Component | simple callout', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{simple-callout}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#simple-callout}}
      template block text
    {{/simple-callout}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});


test('it displays button text', function(assert) {

  this.render(hbs`{{simple-callout button-text='button text'}}`);

  assert.equal(this.$().text().trim(), 'button text');
});
