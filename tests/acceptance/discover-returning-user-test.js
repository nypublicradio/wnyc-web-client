import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';
import ENV from 'overhaul/config/environment';
import RSVP from 'rsvp';

import 'overhaul/tests/helpers/ember-sortable/test-helpers';

moduleForAcceptance('Acceptance | discover returning user', {
  beforeEach() {
    Ember.$.Velocity.mock = true;
    let session = currentSession(this.application);
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});
    server.createList('discover-story', 10);
    let shows = server.createList('show', 10);
    session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows
    session.set('data.discover-topics', ['music']); // set some saved topics
    session.set('data.discover-excluded-story-ids', []);
    session.set('data.discover-queue',  server.db.discoverStories); // set some saved stories
  },
  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('users who finished setup are redirected /discover -> /discover/playlist', function(assert) {
  let session = currentSession(this.application);
  session.set('data.discover-setup-complete', true);
  visit('/discover');
  
  andThen(function() {
    assert.equal(currentURL(), '/discover/playlist', 'should be on the playlist page');
  });
});

test('users who finished step 1 are redirected to finish the flow', function(assert) {
  let session = currentSession(this.application);
  session.set('data.discover-current-setup-step', 'topics');
  visit('/discover');
  
  
  andThen(function() {
    assert.equal(currentURL(), '/discover/start/topics', 'should be on the choose topics page');
  });
});

test('users who finished step 2 are redirected to finish the flow', function(assert) {
  let session = currentSession(this.application);
  session.set('data.discover-current-setup-step', 'shows');
  visit('/discover');
  
  andThen(function() {
    assert.equal(currentURL(), '/discover/start/shows', 'should be on the choose shows page');
  });
});

test('visiting discover/edit starts you on topics', function(assert) {
  visit('/discover/edit');
  andThen(function() {
    assert.equal(currentURL(), '/discover/edit/topics');
  });
});

test('you can not edit and choose zero topics', function(assert) {
  visit('/discover/edit');
  andThen(function() {
    click('a:contains(Pick Topics)');
  });
  andThen(function() {
    click('.discover-topic:contains(Music)');
  });
  andThen(function() {
    click('button:contains(Refresh Playlist)');
  });
  andThen(function() {
    assert.equal(currentURL(), '/discover/edit/topics', 'it should not leave the page');
    assert.equal($('.discover-setup-title-error').text().trim(), 'Please select at least one topic', 'it should show an error message');
  });
});

test('you can browse directly to shows tab', function(assert) {
  visit('/discover/edit/shows');
  andThen(() => {
    assert.equal(currentURL(), '/discover/edit/shows');
  });
});

test('you can browse directly to topics tab', function(assert) {
  visit('/discover/edit/topics');
  andThen(() => {
    assert.equal(currentURL(), '/discover/edit/topics');
  });
});

test('clicking cancel on edit page takes you back to playlist', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
    click("button:contains('Cancel')");

    andThen(function() {
      assert.equal(currentURL(), '/discover/playlist');
    });
  });
});

test('topics are saved in a session and maintained upon next visit in edit flow', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
      assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
      assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
      assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
  });
});

test('shows are saved in a session and maintained upon next visit in edit flow', function(assert) {
  visit('/discover/playlist');

  let session = currentSession(this.application);
  let shows = server.createList('show', 10);
  session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows

  andThen(function() {
    click(".discover-edit-playlist-link");
    andThen(function() {
      click(".discover-setup-tab-link-shows");
      andThen(function() {
        assert.equal(currentURL(), '/discover/edit/shows');
        assert.equal($(".discover-show input").length, server.db.shows.length, "all should be present");
        assert.equal($(".discover-show input:not(:checked)").length, 1, "1 should be not be checked");
        assert.equal($(`.discover-show input[name="${shows[0].slug}"]:not(:checked)`).length, 1, "correct one should be checked");
      });
    });
  });
});

test('if find more returns no more items, the old queue is present and an error message is shown', function(assert) {
  let session = currentSession(this.application);
  var secondRequestCalled = false;
  session.set('data.discover-excluded-story-ids', []);
  visit('/discover/playlist');

  andThen(function() {
    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    andThen(function() {
      let url =[ENV.wnycAPI, 'api/v3/reco_proxy'].join("/");
      server.get(url, function() {
        secondRequestCalled = true;
        let data = server.db.discoverStories.map(s => {
          return {
            type: "Story",
            id: s.id,
            attributes: s
          };
        });
        return {data: data};
      });

      click(".discover-playlist-find-more");
      andThen(function() {
        assert.equal(currentURL(), '/discover/playlist');
        assert.equal(secondRequestCalled, true, "response with no results should have been triggered");

        let matchResults = server.db.discoverStories.map(story => {
          return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
        });

        let matchCount = matchResults.filter(r => (r === true)).length;
        assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the stories in the queue but matched ${matchCount}`);

        assert.equal($(".discover-playlist-no-results").length, 1, "playlist no results error area should be visible");
      });
    });
  });
});


test('if find more returns the same list of items, the old queue are displayed and an error message is shown', function(assert) {
  let session = currentSession(this.application);
  var secondRequestCalled = false;
  session.set('data.discover-excluded-story-ids', []);
  visit('/discover/playlist');

  andThen(function() {
    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    andThen(function() {
      let url =[ENV.wnycAPI, 'api/v3/reco_proxy'].join("/");
      server.get(url, function() {
        secondRequestCalled = true;
        return {data: []};
      });

      click(".discover-playlist-find-more");
      andThen(function() {
        assert.equal(currentURL(), '/discover/playlist');
        assert.equal(secondRequestCalled, true, "response with no results should have been triggered");

        let matchResults = server.db.discoverStories.map(story => {
          return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
        });

        let matchCount = matchResults.filter(r => (r === true)).length;
        assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the stories in the queue but matched ${matchCount}`);

        assert.equal($(".discover-playlist-no-results").length, 1, "playlist no results error area should be visible");
      });
    });
  });
});

test('if find more returns new items, the new items are displayed', function(assert) {
  let session = currentSession(this.application);
  var secondRequestCalled = false;
  session.set('data.discover-excluded-story-ids', []);
  visit('/discover/playlist');

  andThen(function() {
    assert.equal(currentURL(), '/discover/playlist');

    let matchResults = server.db.discoverStories.map(story => {
      return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
    }).uniq();
    assert.ok((matchResults.length === 1) && (matchResults[0] === true), "Should have matched all the stories in the db");
    assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");

    let url =[ENV.wnycAPI, 'api/v3/reco_proxy'].join("/");

    let stories = server.createList('discover-story', 5);

    server.get(url, function() {
      secondRequestCalled = true;
      let data = stories.map(s => {
        return {
          type: "Story",
          id: s.id,
          attributes: s
        };
      });
      return {data: data};
    });

    andThen(function() {
      click(".discover-playlist-find-more");
      andThen(function() {
        assert.equal(currentURL(), '/discover/playlist');
        assert.equal(secondRequestCalled, true, "response with second results have been triggered");

        let matchResults = stories.map(story => {
          return ($(`.discover-playlist-story-title a:contains(${story.title})`).length === 1);
        });

        let matchCount = matchResults.filter(r => (r === true)).length;
        assert.ok((matchResults.uniq().length === 1) && (matchResults.uniq()[0] === true), `Should have matched all the new stories but matched ${matchCount}`);

        assert.equal($(".discover-playlist-no-results").length, 0, "playlist no results error area should not be visible");
      });
    });
  });
});

test('stories are displayed from saved session data', function(assert) {
  visit('/discover/playlist');
  andThen(() =>{
    server.db.discoverStories.forEach(story => {
      assert.equal($(`.discover-playlist:contains(${story.title})`).length, 1);
    });
  });
});

test('selected topics are not retained if you hit cancel', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    click(".discover-topic input[name='art']");
    andThen(() =>{
      assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox was selected");
      click('button:contains("Cancel")');
      andThen(() =>{
        click(".discover-edit-playlist-link");
        andThen(() =>{
          assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox state should have been reset to saved state");
        });
      });
    });
  });
});

test('selected topics are retained temporarily when switching between tabs', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    click(".discover-topic input[name='art']");
    andThen(() =>{
      assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox was selected");
      click('.discover-setup-tab-link-shows');
      andThen(() =>{
        assert.equal(currentURL(), '/discover/edit/shows');
        click('.discover-setup-tab-link-topics');
        andThen(() =>{
          assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox state should have stayed the same");
        });
      });
    });
  });
});

test('selected shows are not retained if you hit cancel', function(assert) {
  let session = currentSession(this.application);
  let shows = server.createList('show', 10);
  session.set('data.discover-excluded-shows',  [shows[0].slug]); // set some excluded shows

  visit('/discover/edit/topics');

  andThen(function() {
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    click(".discover-topic input[name='art']");
    andThen(() =>{
      assert.equal($(".discover-topic input[name='art']").prop('checked'), true, "Checkbox was selected");
      click('button:contains("Cancel")');
      andThen(() =>{
        click(".discover-edit-playlist-link");
        andThen(() =>{
          assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox state should have been reset to saved state");
        });
      });
    });
  });
});

test('deleting an item sends a delete listen action', function(assert) {
  let stories = server.db.discoverStories;
  var story = stories[0];

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', story.id, 'delete'].join("/");
  var listenActionSent = false;
  server.post(url, function() {
    listenActionSent = true;
  });

  visit('/discover/playlist');

  andThen(() => {
    click(`.discover-playlist-item-delete[data-story-id="${story.id}"]`);
    andThen(() => {
      assert.equal(listenActionSent, true, "action should have been called");
    });
  });
});

test('deleting an item removes the item from the list', function(assert) {
  let stories = server.db.discoverStories;
  var story = stories[0];
  visit('/discover/playlist');
  andThen(() => {
    click(`.discover-playlist-item-delete[data-story-id="${story.id}"]`);
    andThen(() => {
      return new RSVP.Promise(function(resolve) {
        // pause while making the test wait
        window.setTimeout(function() {
            resolve();
        }, 1000);
      }).then(function() {
        assert.equal($(`[data-story-id="${story.id}"]`).parent('.is-deleted').length, 1, "item should be marked as deleted");
      });
    });
  });
});

test('playlist shows all items', function(assert) {
  server.createList('discover-story', 12);
  let stories = server.db.discoverStories;
  let session = currentSession(this.application);

  session.set('data.discover-queue',  []);
  session.set('data.discover-excluded-story-ids',  []);

  visit('/discover/playlist');
  andThen(() => {
    stories.forEach(story => {
      assert.equal($(`.discover-playlist-story-title a:contains(${story.title})`).length, 1, "playlist should contain story title");
    });
  });
});

test('playlist does not show excluded item when loaded from the queue', function(assert) {
  server.createList('discover-story', 12);
  let stories = server.db.discoverStories;
  let session = currentSession(this.application);

  let exclude = stories[0];
  session.set('data.discover-excluded-story-ids',  [exclude.id]);

  visit('/discover/playlist');
  andThen(() => {
    assert.equal($(`.discover-playlist-story-title a:contains(${exclude.title})`).length, 0, "excluded story should not be there when loaded from the queue");
  });
});

test('playlist does not show excluded item when loaded from the store', function(assert) {
  server.createList('discover-story', 12);
  let stories = server.db.discoverStories;
  let session = currentSession(this.application);
  let exclude = stories[0];
  session.set('data.discover-queue',  []);
  session.set('data.discover-excluded-story-ids', [exclude.id]);
  visit('/discover/playlist');
  andThen(() => {
    assert.equal($(`.discover-playlist-story-title a:contains(${exclude.title})`).length, 0, "excluded story should not be there when loaded from the store");
  });
});


test('playlist shows all the fields when loaded from the queue/session', function(assert) {
  server.createList('discover-story', 12);
  let stories = server.db.discoverStories;
  let session = currentSession(this.application);
  let example = stories[0];
  session.set('data.discover-queue',  []);
  session.set('data.discover-excluded-story-ids', []);
  visit('/discover/playlist');
  andThen(() => {
    assert.equal($(`.discover-playlist-story-title a:contains(${example.title})`).length, 1, "should show story title");
    assert.equal($(`.discover-playlist-story-show-title a:contains(${example.headers.brand.title})`).length, 1, "should display show title");
  });
});

test('the list can be reordered by dragging', function(assert) {
  visit('/discover/playlist');

  var currentPlaylistOrder = function() {
    return $('.discover-playlist-item').map(function() { return $(this).attr('id'); }).toArray();
  };

  andThen(() => {
    let originalOrder = currentPlaylistOrder();
    let second = originalOrder[1];

    let offsetFunction = function() {
      return {
        dy: -200,
        dx:0
      };
    };

    return drag('mouse', `#${second} .discover-playlist-item-handle`, offsetFunction).then(() => { // jshint ignore:line
      return new RSVP.Promise(function(resolve) {
        // pause while making the test wait
        window.setTimeout(function() {
          resolve();
        }, 1000);
      }).then(function() {
        let newOrder = currentPlaylistOrder();
        let expectedOrder = [].concat(originalOrder);
        expectedOrder.unshift(expectedOrder.splice(1,1)[0]);
        assert.deepEqual(newOrder, expectedOrder, "second item should be in first position");
      });
    });
  });
});

test('reording the list after deleting does not bring back the deleted item', function(assert) {
  visit('/discover/playlist');

  var currentVisiblePlaylistOrder = function() {
    return $('.discover-playlist-item:not(.is-deleted)').map(function() { return $(this).attr('id'); }).toArray();
  };

  let stories = server.db.discoverStories;

  let test1 = stories[4];
  let test2 = stories[2];

  click(`.discover-playlist-item-delete[data-story-id="${test1.id}"]`);
  click(`.discover-playlist-item-delete[data-story-id="${test2.id}"]`);

  andThen(() => {
    let originalOrder = currentVisiblePlaylistOrder();
    let second = originalOrder[1];

    let offsetFunction = function() {
      return {
        dy: -200,
        dx:0
      };
    };

      return drag('mouse', `#${second} .discover-playlist-item-handle`, offsetFunction).then(() => { // jshint ignore:line
        return new RSVP.Promise(function(resolve) {
          // pause while making the test wait
          window.setTimeout(function() {
            resolve();
          }, 1000);
        }).then(function() {
          let newOrder = currentVisiblePlaylistOrder();
          let expectedOrder = [].concat(originalOrder);
          expectedOrder.unshift(expectedOrder.splice(1,1)[0]);
          assert.deepEqual(newOrder.length, expectedOrder.length, "items should not have been added");
          assert.deepEqual(newOrder, expectedOrder, "second item should be in first position");
        });
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
