import { findAll, currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import showPage from 'wqxr-web-client/tests/pages/show';

module('Acceptance | Listing Page | paginating', function(hooks) {
  setupApplicationTest(hooks);

  test('showing pagination for a list of episodes', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/episodes/1',
      teaseList: server.createList('story', 10),
      totalCount: 50
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'}
      ],
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(findAll('#pagefooter').length, 1, 'is showing pagination');
  });

  test('showing no pagination on about pages', async function(assert) {
    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'about', title: 'About'},
      ],
      apiResponse: server.create('api-response', { id: 'shows/foo/about' })
    });

    await visit('shows/foo');

    assert.equal(findAll('#pagefooter').length, 0, 'is not showing pagination');
  });

  test('showing no pagination on story detail listing pages', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: 'shows/foo/story/1',
      story: server.create('story')
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'story', title: 'Story'}
      ],
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(findAll('#pagefooter').length, 0, 'is not showing pagination');
  });

  test('can go back and forward', async function(assert) {
    let api1 = 'shows/foo/episodes/1';
    let api2 = 'shows/foo/episodes/2';

    let apiResponse = server.create('api-response', {
      id: api1,
      teaseList: server.createList('story', 10),
      totalCount: 50
    });
    server.create('api-response', {
      id: api2,
      teaseList: server.createList('story', 10),
      totalCount: 50
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
      ],
      apiResponse
    });

    let firstStoryTitle;

    await visit('shows/foo');

    firstStoryTitle = showPage.storyTitles[0];
    await showPage.clickNext();
    assert.notEqual(firstStoryTitle, showPage.storyTitles[0], 'first story title should be different');
    assert.equal(currentURL(), `/${api2}`, 'uses nav slug when paginating');
    await showPage.clickBack();
    assert.equal(currentURL(), `/${api1}`, 'uses nav slug when paginating');
    assert.equal(firstStoryTitle, showPage.storyTitles[0], 'first story title should be the same');
  });

  test('proper paginating for listing pages without a linkroll', async function(assert) {
    // api-responses without a linkroll associated are just the stories associated
    // with the listing object
    let api1 = 'shows/foo/recent_stories/1';
    let api2 = 'shows/foo/recent_stories/2';

    let apiResponse = server.create('api-response', {
      id: api1,
      teaseList: server.createList('story', 10),
      totalCount: 50
    });
    server.create('api-response', {
      id: api2,
      teaseList: server.createList('story', 10),
      totalCount: 50
    });

    server.create('listing-page', {
      id: 'shows/foo',
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(currentURL(), 'shows/foo');
    await showPage.clickNext();
    assert.equal(currentURL(), '/shows/foo/2', 'correct url when paginating');
    await showPage.clickBack();
    assert.equal(currentURL(), '/shows/foo/1', 'adds page number when going back');
  });

  test('can navigate to a specified page of results', async function(assert) {
    let api1 = 'shows/foo/episodes/1';
    let api4 = 'shows/foo/episodes/4';

    let apiResponse = server.create('api-response', {
      id: api1,
      teaseList: server.createList('story', 10),
      totalCount: 500
    });
    server.create('api-response', {
      id: api4,
      teaseList: server.createList('story', 10)
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
      ],
      apiResponse
    });

    let firstStoryTitle;

    await visit('shows/foo');

    firstStoryTitle = showPage.storyTitles[0];
    await showPage.clickPage(4);
    assert.notEqual(firstStoryTitle, showPage.storyTitles[0]);
    assert.equal(currentURL(), `/${api4}`, 'uses nav slug when paginating');
  });

  test('can land on a page number', async function(assert) {
    let api1 = 'shows/foo/episodes/1';
    let api5 = 'shows/foo/episodes/5';

    let apiResponse = server.create('api-response', {
      id: api5,
      teaseList: server.createList('story', 10),
      totalCount: 60
    });
    server.create('api-response', {
      id: api1,
      teaseList: server.createList('story', 50)
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
      ],
      apiResponse
    });

    await visit(api5);

    assert.equal(currentURL(), api5, 'can land directly on a page of results');
    assert.equal(find('.pagefooter-current').textContent.trim(), '5', 'current page number is 5');
  });

  test('it only shows ten pages at a time', async function(assert) {
    let apiResponse = server.create('api-response', {
      id: `shows/foo/episodes/1`,
      teaseList: server.createList('story', 10),
      totalCount: 500
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [{'nav-slug': 'episodes', title: 'Episodes'}],
      apiResponse
    });

    await visit('shows/foo');

    assert.equal(findAll('.pagefooter-current').length, 1, 'one current page number');
    assert.equal(findAll('.pagefooter-link').length, 10, 'links 2-9 and one final page');
    assert.equal(findAll('.dots').length, 1, 'should only be one set of dots');
    assert.equal(find('.dots + .pagefooter-link').textContent.trim(), '50', 'final link should follow dots');
    assert.equal(findAll('.pagefooter-link')[9].textContent.trim(), '50', 'final link should be 50');
  });

  test('clicking on a page number takes to the page of the correct tab', async function(assert) {
    let episodesPage1 = 'shows/foo/episodes/1';
    let apiResponse = server.create('api-response', {
      id: episodesPage1,
      teaseList: server.createList('story', 10),
      totalCount: 60
    });
    let segmentsPage1 = 'shows/foo/segments/1';
    let segmentsPage3 = 'shows/foo/segments/3';

    server.create('api-response', {
      id: segmentsPage1,
      teaseList: server.createList('story', 10),
      totalCount: 60
    });
    server.create('api-response', {
      id: segmentsPage3,
      teaseList: server.createList('story', 10),
      totalCount: 60
    });

    server.create('listing-page', {
      id: 'shows/foo',
      linkroll: [
        {'nav-slug': 'episodes', title: 'Episodes'},
        {'nav-slug': 'segments', title: 'Segments'}
      ],
      apiResponse
    });

    await visit('shows/foo');

    await showPage.clickNavLink('Segments');
    await showPage.clickPage(3);
    assert.equal(currentURL(), `/${segmentsPage3}`);
  });
});
