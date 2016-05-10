import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | discover');

test('can visit discover from the home page', function(assert) {
  visit('/');

  andThen(function() {
    click('.l-page-nav .list-item [href*="discover"]');

    andThen(function() {
      assert.equal(currentURL(), '/discover/start');
    });
  });
});

test('button exists to create new discover station', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Create My Own")');

    andThen(function() {
      assert.equal(currentURL(), '/discover/topics');
    });
  });
});

test('shows list of topics', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Create My Own")');
    andThen(function() {
      assert.equal($(".discover-topic").length, 20);
    });
  });
});
