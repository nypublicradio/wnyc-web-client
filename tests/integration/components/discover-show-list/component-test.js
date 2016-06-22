import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-show-list', 'Integration | Component | discover show list', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('passing in selected shows checks selected items', function(assert) {
  let shows = server.createList('show', 5);
  this.set('shows', shows);
  this.set('selectedShowSlugs', shows.mapBy('slug'));
  this.render(hbs`{{discover-show-list shows=shows selectedShowSlugs=selectedShowSlugs}}`);
  assert.equal(this.$('input[type=checkbox]:checked').length, 5);
});

test('passing in no selected shows has all items unchecked', function(assert) {
  let shows = server.createList('show', 5);
  this.set('shows', shows);
  this.set('selectedShowSlugs', []);
  this.render(hbs`{{discover-show-list shows=shows selectedShowSlugs=selectedShowSlugs}}`);
  assert.equal(this.$('input[type=checkbox]:checked').length, 0);
});

test('clicking on a show sends an updated shows list', function(assert) {
  let shows = server.createList('show', 5);
  this.set('shows', shows);
  this.set('selectedShowSlugs', []);
  this.set('currentlySelected', []);

  this.render(hbs`{{discover-show-list shows=shows selectedShowSlugs=selectedShowSlugs onShowsUpdated=(action (mut currentlySelected))}}`);

  this.$('.discover-show')[0].click();
  assert.equal(this.get('currentlySelected').length, 1);
});
