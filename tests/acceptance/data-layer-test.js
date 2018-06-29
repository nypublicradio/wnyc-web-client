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
      'Viewed Show Title': showListingPage.title,
      'Viewed Item Type': 'show',
      'Viewed ID': showListingPage.cmsPK.toString(),
      'Viewed Story Major Tags': 'none',
      'Viewed Story Tags': 'none',
      'Viewed Org ID': '0',
      'Viewed Has Audio': '0',
      'Viewed Story Word Count': 'none',
      'Viewed NPR ID': 'none',
    }), 'correct values for show');

    await visit('/series/foo');

    assert.ok(layerSpy.calledWith({
      'Viewed Series Title': seriesListingPage.title,
      'Viewed Item Type': 'series',
      'Viewed ID': seriesListingPage.cmsPK.toString(),
      'Viewed Story Major Tags': 'none',
      'Viewed Story Tags': 'none',
      'Viewed Org ID': '0',
      'Viewed Has Audio': '0',
      'Viewed Story Word Count': 'none',
      'Viewed NPR ID': 'none',
    }), 'correct values for series');

    await visit('/articles/foo');

    assert.ok(layerSpy.calledWith({
      'Viewed Article Channel Title': articleChannelListingPage.title,
      'Viewed Item Type': 'articlechannel',
      'Viewed ID': articleChannelListingPage.cmsPK.toString(),
      'Viewed Story Major Tags': 'none',
      'Viewed Story Tags': 'none',
      'Viewed Org ID': '0',
      'Viewed Has Audio': '0',
      'Viewed Story Word Count': 'none',
      'Viewed NPR ID': 'none',
    }), 'correct values for article channels');

    await visit('/tags/foo');

    assert.ok(layerSpy.calledWith({
      'Viewed Tag Title': tagListingPage.title,
      'Viewed Item Type': 'tag',
      'Viewed ID': tagListingPage.cmsPK.toString(),
      'Viewed Story Major Tags': 'none',
      'Viewed Story Tags': 'none',
      'Viewed Org ID': '0',
      'Viewed Has Audio': '0',
      'Viewed Story Word Count': 'none',
      'Viewed NPR ID': 'none',
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
      'Viewed Authors': 'Foo, Bar',
      'Viewed Date Published': story.newsdate,
      'Viewed Show Title': story.showTitle,
      'Viewed Story Title': story.title,
      'Viewed Story Template': story.template,
      'Viewed Story Series': 'Buz Series, Baz Series',
      'Viewed Item Type': 'story',
      'Viewed ID': story.cmsPK.toString(),
      'Viewed Story Major Tags': 'news',
      'Viewed Story Tags': 'politics,entertainment',
      'Viewed Org ID': '1',
      'Viewed Has Audio': true,
      'Viewed Story Word Count': 150,
      'Viewed NPR ID': '5'
    });
    assert.ok(layerSpy.calledWith({
      'Viewed Authors': 'Foo, Bar',
      'Viewed Date Published': story.newsdate,
      'Viewed Show Title': story.showTitle,
      'Viewed Story Title': story.title,
      'Viewed Story Template': story.template,
      'Viewed Story Series': 'Buz Series, Baz Series',
      'Viewed Item Type': 'story',
      'Viewed ID': story.cmsPK.toString(),
      'Viewed Story Major Tags': 'news',
      'Viewed Story Tags': 'politics,entertainment',
      'Viewed Org ID': '1',
      'Viewed Has Audio': true,
      'Viewed Story Word Count': 150,
      'Viewed NPR ID': '5'
    }));
  });
});
