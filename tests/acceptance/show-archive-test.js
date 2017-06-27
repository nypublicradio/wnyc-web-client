import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import config from 'wnyc-web-client/config/environment';
import { isBlank } from 'ember-utils';

moduleForAcceptance('Acceptance | show archive');

let collapse = text => text.split('\n').reject(s => isBlank(s)).map(s => s.trim()).join(' ').trim();

test('visiting /shows/foo/archive', function(assert) {
  server.createList('story', 50);
  server.get(`${config.wnycAPI}/api/v3/story`, function({stories}, {queryParams}) {
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
  visit('/shows/foo/archive');

  andThen(function() {
    assert.equal(currentURL(), '/shows/foo/archive');
    assert.equal(find('[data-test-selector="story-list"] > li').length, 10);
    assert.equal(find('[data-test-selector="title"]').text(), 'foo archive');
    assert.equal(collapse(find('[data-test-selector="dates"]').text()), 'Year: 2017 | 2000');
    assert.ok(/1 2 3 4 5/.test(collapse(find('#pagefooter').text())));
    
    click('[data-test-selector="dates"] a:contains(2000)');
  });
  
  andThen(function() {
    assert.equal(collapse(find('[data-test-selector="dates"]').text()), '< Back 2000 Month: January | June');
    
    click('[data-test-selector="dates"] a:contains(January)');
  });
  
  andThen(function() {
    assert.equal(collapse(find('[data-test-selector="dates"]').text()), '< 2000 January 2000 Day: 2 | 11 | 27');
    
    click('[data-test-selector="dates"] a:contains(11)');
  });
  
  andThen(function() {
    assert.equal(collapse(find('[data-test-selector="dates"]').text()), '< January 2000 Tuesday, January 11 2000');
    
    click('a:contains(< January 2000)');
  });
  
  andThen(function() {
    firstDate = find('[data-test-selector="story-list"] > li:first > h2 > small').text();
    
    fillIn('[data-test-selector="sort"]', 'newsdate');
  });
  
  andThen(function() {
    let oppositeFirstDate = find('[data-test-selector="story-list"] > li:first > h2 > small').text();
    assert.notEqual(firstDate, oppositeFirstDate);
  });
});
