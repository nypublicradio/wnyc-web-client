import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-playlist-story', 'Integration | Component | discover playlist story', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it displays duration in the correct format', function(assert) {
  this.set('story', server.create('discover-story', {estimatedDuration: 120}));

  this.render(hbs`{{discover-playlist-story story=story}}`);
  assert.equal(this.$('.discover-playlist-story--duration').text().trim(), '2 min');
});

test('it displays the name of the story', function(assert) {
  this.set('story', server.create('discover-story', {title: "Person who named puppysite regrets everything"}));

  this.render(hbs`{{discover-playlist-story story=story}}`);
  assert.equal(this.$('.discover-playlist-story--story-title').text().trim(), 'Person who named puppysite regrets everything');
});

test('it displays the show it came from if available', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: "WNYC Inside"}));

  this.render(hbs`{{discover-playlist-story story=story}}`);
  assert.equal(this.$('.discover-playlist-story--show-title').text().trim(), 'WNYC Inside');
});

test('it still renders alright if show is not provided', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: undefined}));

  this.render(hbs`{{discover-playlist-story story=story}}`);
  assert.equal(this.$('.discover-playlist-story--show-title').text().trim(), '');
});
