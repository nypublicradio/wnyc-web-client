import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-box', 'Integration | Component | search box', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{search-box}}`);

  assert.equal(this.$(".searchbox input").text().trim(), '', "Initial text is empty");
});

test('should trigger external action on keyup', function(assert) {

  // test double for the external action
  this.set('filterShows', (actual) => {
    let expected = 'Show Name';
    assert.equal(actual, expected, 'Submitted value is passed to external action');
  });

  this.render(hbs`{{search-box action=filterShows}}`);

  // add text to the search box and trigger a keyup
  this.$('.searchbox input').val('Show Name');
  this.$('.searchbox input').keyup();

});

