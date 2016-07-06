import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('embedded/header-search-field', 'Integration | Component | embedded/header search field', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{embedded/header-search-field}}`);

  assert.equal(this.$('form').length, 1, 'it renders a form');
});

test('it calls the passesd in search attr on submit', function(assert) {
  this.set('search', q => assert.equal(q, 'foo', 'search was invoked'));

  this.render(hbs`{{embedded/header-search-field search=search}}`);

  this.$('#search-input').val('foo');
  this.$('#search-input').change();
  this.$('form').submit();
});
