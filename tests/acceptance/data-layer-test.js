import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | data layer', function(hooks) {
  setupApplicationTest(hooks);

  test('confirming data layer showTitle is present on show page', async function(assert) {
      window.dataLayer = [];

  let listingPage = server.create('listing-page', {
    id: 'shows/foo',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });

    await visit('/shows/foo');

    assert.ok(window.dataLayer.find(d => d.showTitle === listingPage.title), 'it should pushed the listingPage title into the dataLayer');
  });

  test('confirming data layer showTitle is present on story page', async function(assert) {
    window.dataLayer = [];
    let story = server.create('story');
    await visit(`story/${story.slug}`);

    assert.ok(window.dataLayer.find(d => d.showTitle === story.showTitle), 'object is pushed into dataLayer with correct showTitle value');
  });

  test('confirming undefined showTitle on story page does not break page', async function(assert) {
    window.dataLayer = [];
    let story = server.create('story', {showTitle: undefined});
    await visit(`story/${story.slug}`);

    assert.ok(window.dataLayer.find(d => d.showTitle === "The Brian Lehrer Show"), 'it should push the brand title to the dataLayer');
  });

  test('confirming story pages add storyTemplate dataLayer value', async function(assert) {
    window.dataLayer = [];
    let story = server.create('story', {template: 'story_default'});
    await visit(`story/${story.slug}`);

    assert.ok(window.dataLayer.find(d => d.storyTemplate === story.template), 'object is pushed into dataLayer with correct storyTemplate value');
  });
});
