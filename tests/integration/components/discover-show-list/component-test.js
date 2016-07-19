import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-show-list', 'Integration | Component | discover show list', {
  integration: true
});

const shows = [{id: 1, slug: 'radiolab'},
               {id: 2, slug: 'ask-me-another'},
               {id: 3, slug: 'heres-the-thing'},
               {id: 4, slug: 'sound-opinions'}
];


test('passing in excluded shows unchecked selected items', function(assert) {
  this.set('shows', shows);
  this.set('excludedShowSlugs', shows.mapBy('slug').slice(0,1));
  this.render(hbs`{{discover-show-list shows=shows excludedShowSlugs=excludedShowSlugs}}`);
  assert.equal(this.$('input[type=checkbox]:checked').length, 3);
});

test('passing in no excluded shows has all items checked', function(assert) {
  this.set('shows', shows);
  this.render(hbs`{{discover-show-list shows=shows}}`);
  assert.equal(this.$('input[type=checkbox]:checked').length, 4);
});

test('clicking on a show sends an updated shows list', function(assert) {
  this.set('shows', shows);
  this.set('currentShowExclusion', []);

  this.render(hbs`{{discover-show-list shows=shows onShowsUpdated=(action (mut currentShowExclusion))}}`);

  assert.equal(this.$('input[type=checkbox]:checked').length, 4, "all should be selected");
  this.$('.discover-show')[0].click();

  assert.equal(this.get('currentShowExclusion').length, 1, "should have excluded shows");
});
