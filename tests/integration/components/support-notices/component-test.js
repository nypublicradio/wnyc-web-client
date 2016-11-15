import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('support-notices', 'Integration | Component | support notices', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{support-notices}}`);

  assert.equal(this.$().text().trim(), '');
});

