import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-playlist', 'Integration | Component | discover playlist', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders playlist items', function(assert) {
  const stories = server.createList('discover-story', 12);
  this.set('stories', stories);
  this.render(hbs`{{discover-playlist stories=stories}}`);
  assert.equal(this.$('.discover-playlist-story').length, 12);
});
