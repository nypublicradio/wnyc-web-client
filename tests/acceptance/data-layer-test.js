import { visit } from '@ember/test-helpers';
import { module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Acceptance | data layer', function(hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(() =>  window.dataLayer = []);

  test('listing routes push correct values into dataLayer', async function(assert) {
    let layerSpy = this.spy(window.dataLayer, 'push');

    let showListingPage = server.create('listing-page', {
      id: 'shows/foo',
      cmsPK: 500,
      listingObjectType: 'show',
      apiResponse: server.create('api-response', { id: 'shows/foo/recent_stories/1' }),
    });

    let seriesListingPage = server.create('listing-page', {
      id: 'series/foo',
      cmsPK: 600,
      listingObjectType: 'series',
      apiResponse: server.create('api-response', { id: 'series/foo/recent_stories/1' }),
    });

    let articleChannelListingPage = server.create('listing-page', {
      id: 'articles/foo',
      cmsPK: 800,
      listingObjectType: 'articlechannel',
      apiResponse: server.create('api-response', { id: 'articles/foo/recent_stories/1' }),
    });

    let tagListingPage = server.create('listing-page', {
      id: 'tags/foo',
      cmsPK: 1000,
      listingObjectType: 'tag',
      apiResponse: server.create('api-response', { id: 'tags/foo/recent_stories/1' }),
    });

    await visit('/shows/foo');

    assert.ok(layerSpy.calledWith({
      'Show Title': showListingPage.title,
      'Item Type': 'show',
      'ID': showListingPage.cmsPK.toString(),
      'Major Tags': 'none',
      'Tags': 'none',
      'Org ID': '0',
      'Has Audio': '0',
      'Word Count': 'none',
      'NPR ID': 'none',
    }), 'correct values for show');

    await visit('/series/foo');

    assert.ok(layerSpy.calledWith({
      'Series Title': seriesListingPage.title,
      'Item Type': 'series',
      'ID': seriesListingPage.cmsPK.toString(),
      'Major Tags': 'none',
      'Tags': 'none',
      'Org ID': '0',
      'Has Audio': '0',
      'Word Count': 'none',
      'NPR ID': 'none',
    }), 'correct values for series');

    await visit('/articles/foo');

    assert.ok(layerSpy.calledWith({
      'Article Channel Title': articleChannelListingPage.title,
      'Item Type': 'articlechannel',
      'ID': articleChannelListingPage.cmsPK.toString(),
      'Major Tags': 'none',
      'Tags': 'none',
      'Org ID': '0',
      'Has Audio': '0',
      'Word Count': 'none',
      'NPR ID': 'none',
    }), 'correct values for article channels');

    await visit('/tags/foo');

    assert.ok(layerSpy.calledWith({
      'Tag Title': tagListingPage.title,
      'Item Type': 'tag',
      'ID': tagListingPage.cmsPK.toString(),
      'Major Tags': 'none',
      'Tags': 'none',
      'Org ID': '0',
      'Has Audio': '0',
      'Word Count': 'none',
      'NPR ID': 'none',
    }), 'correct values for tags');
  });

  test('story routes push correct values into dataLayer', async function(assert) {
    let layerSpy = this.spy(window.dataLayer, 'push');
    let story = server.create('story', {
      appearances: {
        authors: [{name: 'Foo'}, {name: 'Bar'}]
      },
      newsdate: "2008-01-01T00:00:00-05:00",
      template: 'default',
      series: [{title: 'Buz Series'}, {title: 'Baz Series'}],
      nprAnalyticsDimensions: [...new Array(4),'news', ...new Array(2), '1', null, true, null, null, 150, '5'],
      tags: ['politics', 'entertainment']
    });

    await visit(`story/${story.slug}`);

    assert.deepEqual(layerSpy.getCall(1).args[0], {
      'Authors': 'Foo, Bar',
      'Date Published': story.newsdate,
      'Show Title': story.showTitle,
      'Story Title': story.title,
      'Story Template': story.template,
      'Story Series': 'Buz Series, Baz Series',
      'Item Type': 'story',
      'ID': story.cmsPK.toString(),
      'Major Tags': 'news',
      'Tags': 'politics,entertainment',
      'Org ID': '1',
      'Has Audio': true,
      'Word Count': 150,
      'NPR ID': '5'
    });
    assert.ok(layerSpy.calledWith({
      'Authors': 'Foo, Bar',
      'Date Published': story.newsdate,
      'Show Title': story.showTitle,
      'Story Title': story.title,
      'Story Template': story.template,
      'Story Series': 'Buz Series, Baz Series',
      'Item Type': 'story',
      'ID': story.cmsPK.toString(),
      'Major Tags': 'news',
      'Tags': 'politics,entertainment',
      'Org ID': '1',
      'Has Audio': true,
      'Word Count': 150,
      'NPR ID': '5'
    }));
  });
});
