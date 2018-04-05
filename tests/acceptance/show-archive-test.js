import {
  click,
  fillIn,
  findAll,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import config from 'wnyc-web-client/config/environment';
import { isBlank } from '@ember/utils';

module('Acceptance | show archive', function(hooks) {
  setupApplicationTest(hooks);

  let collapse = text => text.split('\n').reject(s => isBlank(s)).map(s => s.trim()).join(' ').trim();

  test('visiting /shows/foo/archive', async function(assert) {
    server.createList('story', 50);
    server.get(`${config.publisherAPI}/v3/story`, function({stories}, {queryParams}) {
      assert.deepEqual(Object.keys(queryParams).sort(), [
        'page',
        'uslug',
        'ordering',
        'item_type',
        'year',
        'month',
        'day',
        'meta',
        'page_size',
        'fields[story]'
      ].sort());

      let models = stories.all();
      if (queryParams.ordering) {
        models = models.sort((a, b) => {
          if (queryParams.ordering === '-newsdate') {
            return a.newsdate < b.newsdate ? 1 : -1;
          } else {
            return a.newsdate > b.newsdate ? 1 : -1;
          }
        });
      }
      let json = this.serialize(models.slice(0, 10));
      json.meta = {
        dates: {
          "2000": {
            "1": ["27", "11", "2"],
            "6": ["1"]
          },
          "2017": {
            "5": ["30", "1", "11"]
          }
        },
        pagination: {
          page: 1,
          pages: 5,
          count: 50
        }
      };
      return json;
    });

    let firstDate;
    await visit('/shows/foo/archive');

    assert.equal(currentURL(), '/shows/foo/archive');
    assert.equal(findAll('[data-test-selector="story-list"] > li').length, 10);
    assert.equal(find('[data-test-selector="title"]').textContent, 'foo archive');
    assert.equal(collapse(find('[data-test-selector="dates"]').textContent), 'Year: 2017 | 2000');
    assert.ok(/1 2 3 4 5/.test(collapse(find('#pagefooter').textContent)));

    await click('[data-test-selector="dates"] a:contains(2000)');
    assert.equal(collapse(find('[data-test-selector="dates"]').textContent), '< Back 2000 Month: January | June');

    await click('[data-test-selector="dates"] a:contains(January)');
    assert.equal(collapse(find('[data-test-selector="dates"]').textContent), '< 2000 January 2000 Day: 2 | 11 | 27');

    await click('[data-test-selector="dates"] a:contains(11)');
    assert.equal(collapse(find('[data-test-selector="dates"]').textContent), '< January 2000 Tuesday, January 11 2000');

    await click('a:contains(< January 2000)');
    firstDate = find('[data-test-selector="story-list"] > li:first > h2 > small').textContent;

    await fillIn('[data-test-selector="sort"]', 'newsdate');
    let oppositeFirstDate = find('[data-test-selector="story-list"] > li:first > h2 > small').textContent;
    assert.notEqual(firstDate, oppositeFirstDate);
  });
});
