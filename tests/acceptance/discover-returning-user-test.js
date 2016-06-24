import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';
import ENV from 'overhaul/config/environment';
import RSVP from 'rsvp';

import 'overhaul/tests/helpers/ember-sortable/test-helpers';

moduleForAcceptance('Acceptance | discover returning user', {
  beforeEach() {
    let session = currentSession(this.application);
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});
    server.createList('discover-story', 10);
    let shows = server.createList('show', 10);
    session.set('data.discover-shows',  [shows[0].slug]); // set some saved shows
    session.set('data.discover-topics', ['music']); // set some saved topics
    session.set('data.discover-queue',  server.db.discoverStories); // set some saved stories
  }
});

test('visiting discover/edit starts you on topics', function(assert) {
  visit('/discover/edit');
  andThen(function() {
    assert.equal(currentURL(), '/discover/edit/topics');
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
  let stories = server.createList('show', 10);
  session.set('data.discover-shows',  [stories[0].slug]); // set some saved stories

  andThen(function() {
    click(".discover-edit-playlist-link");
    andThen(function() {
      click(".discover-setup-tab-link-shows");
      andThen(function() {
        assert.equal(currentURL(), '/discover/edit/shows');
        assert.equal($(".discover-show input").length, server.db.shows.length, "all should be present");
        assert.equal($(".discover-show input:checked").length, 1, "1 should be checked");
        assert.equal($(`.discover-show input[name="${stories[0].slug}"]:checked`).length, 1, "correct one should be checked");
      });
    });
  });
});

test('stories are displayed from saved session data', function(assert) {
  let session = currentSession(this.application);
  let story = server.create('discover-story', {title: 'specific-story-title-to-look-for'});
  session.set('data.discover-queue',  [story]); // set some saved stories

  visit('/discover/playlist');
  andThen(() =>{
    assert.equal($('.discover-playlist:contains("specific-story-title-to-look-for")').length, 1);
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
  let stories = server.createList('show', 10);
  session.set('data.discover-shows',  [stories[0].slug]); // set some saved stories

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

  let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', story.cmsPK, 'delete'].join("/");
  var listenActionSent = false;
  server.post(url, function() {
    listenActionSent = true;
  });

  visit('/discover/playlist');

  andThen(() => {
    click(`#story-${story.cmsPK} .discover-playlist-item-delete`);
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
    click(`#story-${story.cmsPK} .discover-playlist-item-delete`);
    andThen(() => {
      return new RSVP.Promise(function(resolve) {
        // pause while making the test wait
        window.setTimeout(function() {
            resolve();
        }, 1000);
      }).then(function() {
        assert.equal($(`#story-${story.cmsPK}.is-deleted`).length, 1, "item should be marked as deleted");
      });
    });
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

  click(`#story-${test1.id} .discover-playlist-item-delete`);
  click(`#story-${test2.id} .discover-playlist-item-delete`);

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
