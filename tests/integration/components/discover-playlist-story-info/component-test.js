import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';
import moment from 'moment';

moduleForComponent('discover-playlist-story-info', 'Integration | Component | discover playlist story info', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it displays duration in the correct format', function(assert) {
  this.set('story', server.create('discover-story', {audioDurationReadable: "2 min"}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-duration').text().trim(), '2 min');
});

test('it displays the date in the correct format', function(assert) {
  this.set('story', server.create('discover-story', {dateLineDatetime: "2016-01-01T12:00:00-04:00"}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-date').text().trim(), 'Jan 1, 2016');
});

test('it displays the date in the correct format for yesterday', function(assert) {
  this.set('story', server.create('discover-story', {dateLineDatetime: moment().subtract(1, 'days').format()}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-date').text().trim(), 'Yesterday');
});

test('it displays the date in the correct format for today', function(assert) {
  this.set('story', server.create('discover-story', {dateLineDatetime: moment().format()}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-date').text().trim(), 'Today');
});

test('it displays the name of the story', function(assert) {
  this.set('story', server.create('discover-story', {title: "Person who named puppysite regrets everything"}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-title').text().trim(), 'Person who named puppysite regrets everything');
});

test('it displays the show it came from if available', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: "WNYC Inside"}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-show-title').text().trim(), 'WNYC Inside');
});

test('it still renders alright if show is not provided', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: undefined}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-show-title').text().trim(), '');
});

test('it does not show summary by default', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: 'yep'}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-info-extended.is-shown').length, 0);
});

test('it shows summary when showSummary is true', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: 'yep'}));

  this.render(hbs`{{discover-playlist-story-info story=story showSummary=true}}`);
  assert.equal(this.$('.discover-playlist-story-info-extended.is-shown').length, 1);
});

test('it adds is-shown class when summary link is clicked', function(assert) {
  this.set('story', server.create('discover-story', {showTitle: 'yep'}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);

  $("a.discover-playlist-story-summary-action-link").click();

  return wait().then(() => {
    assert.equal(this.$('.discover-playlist-story-info-extended.is-shown').length, 1);
  });
});

test('it links to the story url', function(assert) {
  let url = "http://wnyc.org";
  this.set('story', server.create('discover-story', {url: url}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-title a[href]').attr('href'), url);
});

test('it links to the show url', function(assert) {
  let url = "http://wnyc.org";
  this.set('story', server.create('discover-story', {showUrl: url}));

  this.render(hbs`{{discover-playlist-story-info story=story}}`);
  assert.equal(this.$('.discover-playlist-story-show-title a[href]').attr('href'), url);
});
