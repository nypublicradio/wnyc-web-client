import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | discover returning user', {
  beforeEach() {
    let session = currentSession(this.application);
    server.createList('discover-story', 5);
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});
    session.set('data.discover-topics', ['music']); // set some saved topics
  }
});

test('visiting discover/edit starts you on topics', function(assert) {
  visit('/discover/edit');
  andThen(function() {
    assert.equal(currentURL(), '/discover/edit/topics');
  });
});

test('clicking cancel on edit page takes you back to playlist', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
    click("a:contains('Cancel')");
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

// TODO update this after getting discover story component in
test('building a station shows list of shows', function(assert) {
  server.create('discover-story', {title: 'specific-story-title-to-look-for'});
  visit('/discover/playlist');
  andThen(() =>{
    assert.equal($('.discover-playlist:contains("specific-story-title-to-look-for")').length, 1);
  });
});

test('the playlist button says "Start Listening" to begin with', function(assert) {
  server.createList('show', 10);
  server.createList('discover-topic', 20);
  server.createList('discover-story', 20);
  server.createList('ondemand', 3);

  visit('/discover/playlist');

  andThen(function() {
    assert.equal($('.discover-playlist-header-button').text().trim(), "Start Listening");
    click('button.discover-playlist-header-button');

  });
});



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
