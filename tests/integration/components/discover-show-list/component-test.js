import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discover show list', function(hooks) {
  setupRenderingTest(hooks);

  const shows = [{id: 1, slug: 'radiolab'},
                 {id: 2, slug: 'ask-me-another'},
                 {id: 3, slug: 'heres-the-thing'},
                 {id: 4, slug: 'sound-opinions'}
  ];


  test('passing in excluded shows unchecked selected items', async function(assert) {
    this.set('shows', shows);
    this.set('excludedShowSlugs', shows.mapBy('slug').slice(0,1));
    await render(hbs`{{discover-show-list shows=shows excludedShowSlugs=excludedShowSlugs}}`);
    assert.equal(findAll('input[type=checkbox]:checked').length, 3);
  });

  test('passing in no excluded shows has all items checked', async function(assert) {
    this.set('shows', shows);
    await render(hbs`{{discover-show-list shows=shows}}`);
    assert.equal(findAll('input[type=checkbox]:checked').length, 4);
  });

  test('clicking on a show sends an updated shows list', async function(assert) {
    this.set('shows', shows);
    this.set('currentShowExclusion', []);

    await render(hbs`{{discover-show-list shows=shows onShowsUpdated=(action (mut currentShowExclusion))}}`);

    assert.equal(findAll('input[type=checkbox]:checked').length, 4, "all should be selected");
    this.$('.discover-show')[0].click();

    assert.equal(this.get('currentShowExclusion').length, 1, "should have excluded shows");
  });
});
