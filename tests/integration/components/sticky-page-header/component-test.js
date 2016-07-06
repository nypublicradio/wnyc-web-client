import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sticky-page-header', 'Integration | Component | sticky page header', {
  integration: true
});

test('on sticky set it sets the spacer to the height of the content when sticky', function(assert) {
  this.set('sticky', false);

  this.render(hbs`
    {{#sticky-page-header sticky=sticky}}
      <div style="height:200px"></div>
    {{/sticky-page-header}}
  `);

  assert.equal(this.$('.sticky-page-header-spacer').height(), 0);
  this.set('sticky', true);
  assert.equal(this.$('.sticky-page-header-spacer').height(), 200, "header spacer should be height of sticky area");
  this.set('sticky', false);
  assert.equal(this.$('.sticky-page-header-spacer').height(), 0, "header spacer should be zero when sticky is off");
});
