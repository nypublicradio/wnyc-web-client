import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import moment from 'moment';

module('Integration | Component | discover playlist story info', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    startMirage(this.container);
  });

  hooks.afterEach(function() {
    window.server.shutdown();
  });

  test('it displays duration in the correct format', async function(assert) {
    this.set('story', server.create('discover-story', {audioDurationReadable: "2 min"}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-duration').textContent.trim(), '2 min');
  });

  test('it displays the date in the correct format', async function(assert) {
    this.set('story', server.create('discover-story', {newsdate: "2016-01-01T12:00:00-04:00"}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-date').textContent.trim(), 'Jan 1, 2016');
  });

  test('it displays the date in the correct format for yesterday', async function(assert) {
    this.set('story', server.create('discover-story', {newsdate: moment().subtract(1, 'days').format()}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-date').textContent.trim(), 'Yesterday');
  });

  test('it displays the date in the correct format for today', async function(assert) {
    this.set('story', server.create('discover-story', {newsdate: moment().format()}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-date').textContent.trim(), 'Today');
  });

  test('it displays the name of the story', async function(assert) {
    this.set('story', server.create('discover-story', {title: "Person who named puppysite regrets everything"}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-title').textContent.trim(), 'Person who named puppysite regrets everything');
  });

  test('it displays the show it came from if available', async function(assert) {
    this.set('story', server.create('discover-story', {showTitle: "WNYC Inside"}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-show-title').textContent.trim(), 'WNYC Inside');
  });

  test('it still renders alright if show is not provided', async function(assert) {
    this.set('story', server.create('discover-story', {showTitle: undefined}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-show-title').textContent.trim(), '');
  });

  test('it does not show summary by default', async function(assert) {
    this.set('story', server.create('discover-story', {showTitle: 'yep'}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(findAll('.discover-playlist-story-info-extended.is-shown').length, 0);
  });

  test('it shows summary when showSummary is true', async function(assert) {
    this.set('story', server.create('discover-story', {showTitle: 'yep'}));

    await render(hbs`{{discover-playlist-story-info story=story showSummary=true}}`);
    assert.equal(findAll('.discover-playlist-story-info-extended.is-shown').length, 1);
  });

  test('it adds is-shown class when summary link is clicked', async function(assert) {
    this.set('story', server.create('discover-story', {showTitle: 'yep'}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);

    await click("a.discover-playlist-story-summary-action-link");

    assert.equal(findAll('.discover-playlist-story-info-extended.is-shown').length, 1);
  });

  test('it links to the story url', async function(assert) {
    let url = "http://wnyc.org";
    this.set('story', server.create('discover-story', {url: url}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-title a[href]').getAttribute('href'), url);
  });

  test('it links to the show url', async function(assert) {
    let url = "http://wnyc.org";
    this.set('story', server.create('discover-story', {showUrl: url}));

    await render(hbs`{{discover-playlist-story-info story=story}}`);
    assert.equal(find('.discover-playlist-story-show-title a[href]').getAttribute('href'), url);
  });
});
