import $ from 'jquery';
import { later } from '@ember/runloop';
import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession } from 'ember-simple-auth/test-support';
import RSVP from 'rsvp';
import config from 'wnyc-web-client/config/environment';
import velocity from 'velocity';

import 'wnyc-web-client/tests/helpers/ember-sortable/test-helpers';

module('Acceptance | discover returning user', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    velocity.mock = true;
    let session = currentSession();
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});
    server.createList('discover-story', 10);
    let shows = server.createList('show', 10);
    session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows
    session.set('data.discover-topics', ['music']); // set some saved topics
    session.set('data.discover-excluded-story-ids', []);
    session.set('data.discover-queue', server.serializerOrRegistry.serialize(server.schema.discoverStories.all())); // set some saved stories

    server.create('stream');
  });

  hooks.afterEach(function() {
    velocity.mock = false;
  });

  test('users who finished setup are redirected /discover -> /discover/playlist', async function(assert) {
    let session = currentSession();
    session.set('data.discover-setup-complete', true);
    await visit('/discover');

    assert.equal(currentURL(), '/discover/playlist', 'should be on the playlist page');
  });

  test('users who finished step 1 are redirected to finish the flow', async function(assert) {
    let session = currentSession();
    session.set('data.discover-current-setup-step', 'topics');
    await visit('/discover');


    assert.equal(currentURL(), '/discover/start/topics', 'should be on the choose topics page');
  });

  test('users who finished step 2 are redirected to finish the flow', async function(assert) {
    let session = currentSession();
    session.set('data.discover-current-setup-step', 'shows');
    await visit('/discover');

    assert.equal(currentURL(), '/discover/start/shows', 'should be on the choose shows page');
  });

  test('visiting discover/edit starts you on topics', async function(assert) {
    await visit('/discover/edit');
    assert.equal(currentURL(), '/discover/edit/topics');
  });

  test('you can not edit and choose zero topics', async function(assert) {
    await visit('/discover/edit');
    await click('a');
    await click('.discover-topic');
    assert.notOk(find('.discover-topic.is-selected'), 'no topics should be selected');
    await click('button');
    assert.equal(currentURL(), '/discover/edit/topics', 'it should not leave the page');
    assert.equal(find('.discover-setup-title-error').textContent.trim(), 'Please select at least one topic', 'it should show an error message');
  });

  test('you can not edit and choose zero shows', async function(assert) {
    await visit('/discover/edit');
    await click('a');
    await click('.discover-show.is-selected');
    assert.notOk(find('.discover-show.is-selected'), 'no shows should be selected');
    await click('button');
    assert.equal(currentURL(), '/discover/edit/shows', 'it should not leave the page');
    assert.equal(find('.discover-setup-title-error').textContent.trim(), 'Please select at least one show', 'it should show an error message');
  });

  test('you can browse directly to shows tab', async function(assert) {
    await visit('/discover/edit/shows');
    assert.equal(currentURL(), '/discover/edit/shows');
  });

  test('you can browse directly to topics tab', async function(assert) {
    await visit('/discover/edit/topics');
    assert.equal(currentURL(), '/discover/edit/topics');
  });

  test('clicking cancel on edit page takes you back to playlist', async function(assert) {
    await visit('/discover/edit/topics');
    await click("button");

    assert.equal(currentURL(), '/discover/playlist');
  });

  test('topics are saved in a session and maintained upon next visit in edit flow', async function(assert) {
    await visit('/discover/edit/topics');
    assert.equal(find(".discover-topic input[name='music']").checked, true, "Checkbox was not checked");
    assert.equal(find(".discover-topic input[name='art']").checked, false, "Checkbox was checked when it shouldn't be");
    assert.equal(find(".discover-topic input[name='technology']").checked, false, "Checkbox was checked when it shouldn't be");
  });

  test('shows are saved in a session and maintained upon next visit in edit flow', async function(assert) {
    await visit('/discover/playlist');

    let session = currentSession();
    let shows = server.createList('show', 10);
    session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows

    await click(".discover-edit-playlist-link");
    await click(".discover-setup-tab-link-shows");
    assert.equal(currentURL(), '/discover/edit/shows');
    assert.equal(findAll(".discover-show input").length, server.db.shows.length, "all should be present");
    assert.equal(findAll(".discover-show input:not(:checked)").length, 1, "1 should be not be checked");
    assert.equal(findAll(`.discover-show input[name="${shows[0].slug}"]:not(:checked)`).length, 1, "correct one should be checked");
  });

  test('if find more returns no more items, the old queue is present and an error message is shown', async function(assert) {
    let discoverPath = config.featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';
    let session = currentSession();
    var secondRequestCalled = false;
    session.set('data.discover-excluded-story-ids', []);
    await visit('/discover/playlist');

    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    let url = [config.publisherAPI, 'v3', discoverPath].join("/");
    server.get(url, function(schema) {
      secondRequestCalled = true;
      return this.serialize(schema.discoverStories.all());
    });

    await click(".discover-playlist-find-more");
    assert.equal(currentURL(), '/discover/playlist');
    assert.equal(secondRequestCalled, true, "response with no results should have been triggered");

    matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    });

    let matchCount = matchResults.filter(r => (r === true)).length;
    assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the stories in the queue but matched ${matchCount}`);

    assert.equal($(".discover-playlist-no-results").length, 1, "playlist no results error area should be visible");
  });


  test('if find more returns the same list of items, the old queue are displayed and an error message is shown', async function(assert) {
    let discoverPath = config.featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';
    let session = currentSession();
    var secondRequestCalled = false;
    session.set('data.discover-excluded-story-ids', []);
    await visit('/discover/playlist');

    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    let url = [config.publisherAPI, 'v3', discoverPath].join("/");
    server.get(url, function() {
      secondRequestCalled = true;
      return {data: []};
    });

    await click(".discover-playlist-find-more");
    assert.equal(currentURL(), '/discover/playlist');
    assert.equal(secondRequestCalled, true, "response with no results should have been triggered");

    matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    });

    let matchCount = matchResults.filter(r => (r === true)).length;
    assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the stories in the queue but matched ${matchCount}`);

    assert.equal($(".discover-playlist-no-results").length, 1, "playlist no results error area should be visible");
  });

  test('if find more returns new items, the new items are displayed', async function(assert) {
    let discoverPath = config.featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';
    let session = currentSession();
    let secondRequestCalled = false;
    let thirdRequestCalled = false;
    session.set('data.discover-excluded-story-ids', []);
    await visit('/discover/playlist');

    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    let url = [config.publisherAPI, 'v3', discoverPath].join("/");

    let stories = server.createList('discover-story', 5);

    server.get(url, function(schema) {
      secondRequestCalled = true;
      let json = this.serialize(schema.discoverStories.all());
      json.data = json.data.slice(-5);
      return json;
    });

    await click(".discover-playlist-find-more");
    assert.equal(currentURL(), '/discover/playlist');
    assert.equal(secondRequestCalled, true, "response with second results have been triggered");

    matchResults = stories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    });

    let matchCount = matchResults.filter(r => (r === true)).length;
    assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the new stories but matched ${matchCount}`);

    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");
    stories = server.createList('discover-story', 5);
    server.get(url, function(schema) {
      thirdRequestCalled = true;
      let json = this.serialize(schema.discoverStories.all());
      json.data = json.data.slice(-5);
      return json;
    });
    await click(".discover-refresh-bar");
    assert.equal(currentURL(), '/discover/playlist');
    assert.equal(thirdRequestCalled, true, "response with third results have been triggered");

    matchResults = stories.map(story => {
      return ($(`.discover-playlist-story-title a`).length === 1);
    });

    matchCount = matchResults.filter(r => (r === true)).length;
    assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the new stories but matched ${matchCount}`);

    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");
  });

  test('stories are displayed from saved session data', async function(assert) {
    await visit('/discover/playlist');
    server.db.discoverStories.forEach(story => {
      assert.equal($(`.discover-playlist`).length, 1);
    });
  });

  test('selected topics are not retained if you hit cancel', async function(assert) {
    await visit('/discover/edit/topics');
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    await click(".discover-topic input[name='music']");
    await click(".discover-topic input[name='art']");
    assert.equal($(".discover-topic input[name='music']").prop('checked'), false, "Checkbox was not selected");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox was selected");
    await click('button');
    await click(".discover-edit-playlist-link");
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox state should have been reset to saved state");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox state should have been reset to saved state");
  });

  test('selected topics are retained temporarily when switching between tabs', async function(assert) {
    await visit('/discover/edit/topics');
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    await click(".discover-topic input[name='music']");
    await click(".discover-topic input[name='art']");
    assert.equal($(".discover-topic input[name='music']").prop('checked'), false, "Checkbox was deselected");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox was selected");
    await click('.discover-setup-tab-link-shows');
    assert.equal(currentURL(), '/discover/edit/shows');
    await click('.discover-setup-tab-link-topics');
    assert.equal($(".discover-topic input[name='music']").prop('checked'), false, "Checkbox state should have stayed the same");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox state should have stayed the same");
  });

  test('selected shows are not retained if you hit cancel', async function(assert) {
    let session = currentSession();
    let shows = server.createList('show', 10);
    session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows

    await visit('/discover/edit/topics');
    await click('a');
    assert.equal($(`.discover-show input[name='${shows[0].slug}']`).prop('checked'), false, 'it should start unchecked');
    assert.equal($(`.discover-show input[name='${shows[1].slug}']`).prop('checked'), true, 'it should start checked');

    await click(`.discover-show input[name='${shows[0].slug}']`);
    await click(`.discover-show input[name='${shows[1].slug}']`);
    assert.equal($(`.discover-show input[name='${shows[0].slug}']`).prop('checked'), true, 'it should be deselected');
    assert.equal($(`.discover-show input[name='${shows[1].slug}']`).prop('checked'), false, 'it should be selected');

    await click('button');
    await click(".discover-edit-playlist-link");
    await click('a');
    assert.equal($(`.discover-show input[name='${shows[0].slug}']`).prop('checked'), false, "Checkbox state should have been reset to saved state");
    assert.equal($(`.discover-show input[name='${shows[1].slug}']`).prop('checked'), true, "Checkbox state should have been reset to saved state");
  });

  test('deleting an item removes the item from the list', async function(assert) {
    let stories = server.db.discoverStories;
    var story = stories[0];
    await visit('/discover/playlist');
    await click(`.discover-playlist-item-delete[data-story-id="${story.slug}"]`);
    return new RSVP.Promise(function(resolve) {
      // pause while making the test wait
      later(null, resolve, 1000);
    }).then(function() {
      assert.equal($(`[data-story-id="${story.slug}"]`).parent('.is-deleted').length, 1, "item should be marked as deleted");
    });
  });

  test('playlist shows all items', async function(assert) {
    server.createList('discover-story', 12);
    let stories = server.db.discoverStories;
    let session = currentSession();

    session.set('data.discover-queue',  []);
    session.set('data.discover-excluded-story-ids',  []);

    await visit('/discover/playlist');
    stories.forEach(story => {
      assert.equal($(`.discover-playlist-story-title a`).length, 1, "playlist should contain story title");
    });
  });

  test('playlist does not show excluded item when loaded from the queue', async function(assert) {
    server.createList('discover-story', 12);
    let stories = server.db.discoverStories;
    let session = currentSession();

    let exclude = stories[0];
    session.set('data.discover-excluded-story-ids',  [exclude.slug]);

    await visit('/discover/playlist');
    assert.equal($(`.discover-playlist-story-title a`).length, 0, "excluded story should not be there when loaded from the queue");
  });

  test('playlist does not show excluded item when loaded from the store', async function(assert) {
    server.createList('discover-story', 12);
    let stories = server.db.discoverStories;
    let session = currentSession();
    let exclude = stories[0];
    session.set('data.discover-queue',  []);
    session.set('data.discover-excluded-story-ids', [exclude.slug]);
    await visit('/discover/playlist');
    assert.equal($(`.discover-playlist-story-title a`).length, 0, "excluded story should not be there when loaded from the store");
  });


  test('playlist shows all the fields when loaded from the queue/session', async function(assert) {
    server.createList('discover-story', 12);
    let stories = server.db.discoverStories;
    let session = currentSession();
    let example = stories[0];
    session.set('data.discover-queue',  []);
    session.set('data.discover-excluded-story-ids', []);
    await visit('/discover/playlist');
    assert.equal($(`.discover-playlist-story-title a`).length, 1, "should show story title");
    assert.equal($(`.discover-playlist-story-show-title a`).length, 1, "should display show title");
  });

  skip('the list can be reordered by dragging', async function(assert) {
    await visit('/discover/playlist');

    var currentPlaylistOrder = function() {
      return $('.discover-playlist-item').map(function() { return $(this).attr('id'); }).toArray();
    };

    let originalOrder = currentPlaylistOrder();
    let second = originalOrder[1];

    let offsetFunction = function() {
      return {
        dy: -200,
        dx:0
      };
    };

    return drag('mouse', `#${second} .discover-playlist-item-handle`, offsetFunction).then(() => {
      return new RSVP.Promise(function(resolve) {
        // pause while making the test wait
        later(null, resolve, 1000);
      }).then(function() {
        let newOrder = currentPlaylistOrder();
        let expectedOrder = [].concat(originalOrder);
        expectedOrder.unshift(expectedOrder.splice(1,1)[0]);
        assert.deepEqual(newOrder, expectedOrder, "second item should be in first position");
      });
    });
  });

  skip('reording the list after deleting does not bring back the deleted item', async function(assert) {
    await visit('/discover/playlist');

    var currentVisiblePlaylistOrder = function() {
      return $('.discover-playlist-item:not(.is-deleted)').map(function() { return $(this).attr('id'); }).toArray();
    };

    let stories = server.db.discoverStories;

    let test1 = stories[4];
    let test2 = stories[2];

    await click(`.discover-playlist-item-delete[data-story-id="${test1.slug}"]`);
    await click(`.discover-playlist-item-delete[data-story-id="${test2.slug}"]`);

    let originalOrder = currentVisiblePlaylistOrder();
    let second = originalOrder[1];

    let offsetFunction = function() {
      return {
        dy: -200,
        dx:0
      };
    };

    return drag('mouse', `#${second} .discover-playlist-item-handle`, offsetFunction).then(() => {
      return new RSVP.Promise(function(resolve) {
        // pause while making the test wait
        later(null, resolve, 1000);
      }).then(function() {
        let newOrder = currentVisiblePlaylistOrder();
        let expectedOrder = [].concat(originalOrder);
        expectedOrder.unshift(expectedOrder.splice(1,1)[0]);
        assert.deepEqual(newOrder.length, expectedOrder.length, "items should not have been added");
        assert.deepEqual(newOrder, expectedOrder, "second item should be in first position");
      });
    });
  });


  // TODO: climb the mountain that is making the audio service testable/workable in dev
  // test('the playlist button says "Start Listening" to begin with', function(assert) {
  //   server.createList('show', 10);
  //   server.createList('discover-topic', 20);
  //   server.createList('discover-story', 20);
  //   server.createList('ondemand', 3);
  //
  //   visit('/discover/playlist');
  //
  //   andThen(function() {
  //     assert.equal($('.discover-playlist-header-button').text().trim(), "Start Listening");
  //     click('button.discover-playlist-header-button');
  //
  //   });
  // });



  // TODO: Figure out how to test a loading route. Can't seem to get this to work
  // test('when building a station we show a loading screen', function(assert) {
  //   let done = assert.async();
  //   server.get('/api/v1/make_radio', function() {
  //     assert.equal($("#discover_loading_message").length, 1);
  //     done();
  //   });
  //
  //   visit('/discover/playlist');
  // });
});
