import { test, skip } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';
import { mockExperimentalGroup } from 'overhaul/tests/helpers/mock-experimental-group';
import ENV from 'overhaul/config/environment';
import 'overhaul/tests/helpers/with-feature';

moduleForAcceptance('Acceptance | discover group 0',
  {
    beforeEach() {
      Ember.$.Velocity.mock = true;
      // Google Experiment D4W - Group 0;
      mockExperimentalGroup(0);
      window.Modernizr.touch = false;
    },
    afterEach() {
      Ember.$.Velocity.mock = false;
    }
  }
);

test('can not visit discover from the home page', function(assert) {
  server.create('djangoPage', {id:'/'});
  visit('/');

  andThen(function() {
    assert.equal($('.l-page-nav .list-item [href*="discover"]').length, 0, 'it should not show a discover link');
  });
});

moduleForAcceptance('Acceptance | discover group 1',
  {
    beforeEach() {
      Ember.$.Velocity.mock = true;
      // Google Experiment D4W - Group 1;
      mockExperimentalGroup(1);
      window.Modernizr.touch = false;
      let session = currentSession(this.application);
      session.set('data.discover-excluded-shows',  []);
      session.set('data.discover-topics', []);
      session.set('data.discover-excluded-story-ids', []);
    },
    afterEach() {
      Ember.$.Velocity.mock = false;
    }
  }
);

test('can visit discover from the home page', function(assert) {
  withFeature('discover');
  server.create('djangoPage', {id:'/'});
  visit('/');

  andThen(function() {
    click('.l-page-nav .list-item [href*="discover"]');
  });

  andThen(function() {
    assert.equal(currentURL(), '/discover/start');
  });
});

test('first-time users are redirected /discover -> /discover/start', function(assert) {
  visit('/discover');

  andThen(function() {
    assert.equal(currentURL(), '/discover/start', 'should be on start page');
  });
});

test('button exists to create new discover station', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');

    andThen(function() {
      assert.equal(currentURL(), '/discover/start/topics');
    });
  });
});

test('shows list of topics', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      assert.equal($(".discover-topic").length, 20);
    });
  });
});

test('select all button selects all topics', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      assert.equal($(".discover-topic").length, 20);
      click('button:contains("Select All")');
      andThen(function() {
        assert.equal($(".discover-topic.is-selected").length, 20);
      });
    });
  });
});


test('next button is disabled until a topic is selected', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      assert.equal(currentURL(), '/discover/start/topics');
      assert.equal($('button.mod-filled-red').length, 0, "Button should not be red");
      click(".discover-topic input");
      andThen(function() {
        assert.equal($('button.mod-filled-red').length, 1, "Button should be red");
      });
    });
  });
});

test('next button shows an error if you click it without a topic selected', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      assert.equal(currentURL(), '/discover/start/topics');
      assert.equal($('.discover-setup-title-error').text().trim(), "");
      click('button:contains("Next")');
      andThen(function() {
        assert.equal($('.discover-setup-title-error').text().length > 0, true);
      });
    });
  });
});

test('back goes back to the welcome screen', function(assert) {
  visit('/discover/start');
  server.createList('discover-topic', 20);

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      assert.equal(currentURL(), '/discover/start/topics');
      click("button:contains('Back')");
      andThen(function() {
        assert.equal(currentURL(), '/discover/start');
      });
    });
  });
});

test('topics are saved in a session and maintained upon next visit in initial flow', function(assert) {
  visit('/discover/start');
  server.create('discover-topic', {title: "Music", url: "music"});
  server.create('discover-topic', {title: "Art", url: "art"});
  server.create('discover-topic', {title: "Technology", url: "technology"});

  andThen(() => {
    click('button:contains("Get Started")');
    andThen(() => {
      assert.equal(currentURL(), '/discover/start/topics', "is on topics");
      click(".discover-topic input[name='music']");
      andThen(() => {
        click("button:contains('Next')");
        andThen(function() {
          assert.equal(currentURL(), "/discover/start/shows");
          visit('/discover/start/topics');
          andThen(() => {
            assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
            assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
            assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
          });
        });
      });
    });
  });
});

test('show exclusions are saved in a session and maintained upon next visit in initial flow', function(assert) {
  server.createList('discover-topic', 5);
  let shows = server.createList('show', 5);
  let testShow = shows[0];
  visit('/discover/start');
  click('button:contains("Get Started")');

  andThen(function() {
    click(".discover-topic input");
    click("button:contains('Next')");

    andThen(function() {
      assert.equal(currentURL(), '/discover/start/shows');
      assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), true);
      click(`.discover-show[data-slug="${testShow.slug}"]`);
      click("button:contains('Create Playlist')");

      andThen(function() {
        visit('/discover/start/shows');

        andThen(function() {
          assert.equal($(`.discover-show[data-slug="${testShow.slug}"]`).length, 1);
          assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), false, "should not be checked");
        });
      });
    });
  });
});

test('show exclusions are maintained if you go back to topics screen', function(assert) {
  server.createList('discover-topic', 5);
  let shows = server.createList('show', 5);
  let testShow = shows[0];
  visit('/discover/start');
  click('button:contains("Get Started")');
  andThen(function() {
    click(".discover-topic input");
    andThen(function() {
      click("button:contains('Next')");
      andThen(function() {
        assert.equal(currentURL(), '/discover/start/shows', "should be on shows step");
        assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), true, "show should be selected");
        click(`.discover-show[data-slug="${testShow.slug}"]`);
        andThen(function() {
          click("button:contains('Back')");
          andThen(function() {
            click("button:contains('Next')");
            andThen(function() {
              assert.equal($(`.discover-show[data-slug="${testShow.slug}"]`).length, 1, "test show should exist");
              assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), false, "should not be checked");
            });
          });
        });
      });
    });
  });
});

test('all shows are selected by default', function(assert) {
  server.createList('discover-topic', 5);
  let shows = server.createList('show', 5);
  visit('/discover/start');
  click('button:contains("Get Started")');

  andThen(function() {
    click(".discover-topic input");
    click("button:contains('Next')");
    andThen(function() {
      assert.equal(currentURL(), '/discover/start/shows');
      assert.equal($(`.discover-show input:checked`).length, shows.length, "all shows should be selected");
    });
  });
});

test('create playlist button is disabled if no shows are selected', function(assert) {
  server.createList('discover-topic', 20);
  server.createList('show', 2);

  visit('/discover/start');

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      click(".discover-topic input");
      andThen(function() {
        click("button:contains('Next')");
        andThen(function() {
          assert.equal($('button.mod-filled-red').length, 1, "Button should be red");

          click($(".discover-show")[0]);
          click($(".discover-show")[1]);

          andThen(() => {
            assert.equal(currentURL(), '/discover/start/shows');
            assert.equal($('button.mod-filled-red').length, 0, "Button should not be red");
          });
        });
      });
    });
  });
});

test('create playlist button should show error if clicked if no shows are selected', function(assert) {
  server.createList('discover-topic', 20);
  server.createList('show', 2);

  visit('/discover/start');

  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      click(".discover-topic input");
      andThen(function() {
        click("button:contains('Next')");

        andThen(function() {
          assert.equal($(`.discover-show input:checked`).length, 2, "all shows should be selected");
          assert.equal($('button.mod-filled-red').length, 1, "Button should be red");

          click($(".discover-show")[0]);
          click($(".discover-show")[1]);

          andThen(() => {
            click($('button:contains("Create Playlist")'));

            andThen(() => {
              assert.equal($('.discover-setup-title-error').text().length > 0, true);
              assert.equal(currentURL(), '/discover/start/shows');
            });
          });
        });
      });
    });
  });
});

skip('playlist request sends stories and tags in correct format', function(assert) {
  server.createList('discover-topic', 20);
  server.createList('show', 5);

  visit('/discover/start');

  var done = assert.async();


  andThen(function() {
    click('button:contains("Get Started")');
    andThen(function() {
      click($(".discover-topic input")[0]).then(() => {
        click($(".discover-topic input")[1]);
      }).then(() => {
        click($(".discover-topic input")[2]);
      });

      andThen(function() {
        click("button:contains('Next')");

        andThen(function() {
          click($(".discover-show")[0]).then(() => {
            click($(".discover-show")[1]);
          });

          andThen(() => {
            click($('button:contains("Create Playlist")'));
            //
            let url =[ENV.wnycURL, 'api/v3/make_playlist'].join("/");

            server.get(url, function(schema, request) {

              let topics = server.db.discoverTopics.slice(0,3).mapBy('url').join(',');
              let shows = server.db.shows.slice(0,2).mapBy('slug').join(',');
              assert.equal(request.queryParams.tags, topics);
              assert.equal(request.queryParams.shows, shows);
              done();
            });
          });
        });
      });
    });
  });
});

skip('setup picks up where you left off if you bail half way through', function(assert) {
  server.createList('discover-topic', 5);
  server.createList('show', 5);

  visit('/discover/start');
  click('button:contains("Get Started")');

  andThen(function() {
    click(".discover-topic input");
    click("button:contains('Next')");

    andThen(function() {
      assert.equal(currentURL(), '/discover/start/shows');
      click('a[href="/login"]');
      andThen(function() {
        click('.list-item a[href*="/discover"]');
        andThen(function() {
          assert.equal(currentURL(), '/discover/start/shows', "should be on shows step");
        });
      });
    });
  });
});

test('should be able to go back to welcome screen if you really want to', function(assert) {
  server.createList('discover-topic', 5);
  server.createList('show', 5);

  visit('/discover/start');
  click('button:contains("Get Started")');

  andThen(function() {
    click(".discover-topic input");
    click("button:contains('Next')");

    andThen(function() {
      assert.equal(currentURL(), '/discover/start/shows');
      click(".rounded-caps-button:contains('Back')");
      andThen(function() {
        assert.equal(currentURL(), '/discover/start/topics', "should be on topics screen");
        click(".rounded-caps-button:contains('Back')");
        andThen(function() {
          assert.equal(currentURL(), '/discover/start', "should be on welcome screen");
        });
      });
    });
  });
});

test('nav link sends you to start page', function(assert) {
  withFeature('discover');
  server.createList('discover-topic', 5);
  server.createList('show', 5);
  server.create('djangoPage', {id:'/'});
  visit('/');
  click('.l-page-nav .list-item [href*="discover"]');

  andThen(function() {
    assert.equal(currentURL(), '/discover/start', "should be on start page");
  });
});

test('mobile users get the app download page', function(assert) {
  let oldTouchSetting = window.Modernizr.touch;
  window.Modernizr.touch = true; //spoof this thing
  server.createList('discover-topic', 5);
  visit('/discover/start/topics');
  andThen(function() {
    assert.equal(currentURL(), '/discover/start');
    assert.equal($("a:contains('Download It Now')").length, 1);
    window.Modernizr.touch = oldTouchSetting; // restore this thing
  });
});



moduleForAcceptance('Acceptance | discover group 2',
  {
    beforeEach() {
      Ember.$.Velocity.mock = true;
      // Google Experiment D4W - Group 2;
      mockExperimentalGroup(2);
      window.Modernizr.touch = false;
      let session = currentSession(this.application);
      session.set('data.discover-excluded-shows',  []);
      session.set('data.discover-topics', []);
      session.set('data.discover-excluded-story-ids', []);
    },
    afterEach() {
      Ember.$.Velocity.mock = false;
    }
  }
);

test('it should', function(assert) {
  server.create('djangoPage', {id:'/'});
  visit('/');
  andThen(function() {
    click('.l-page-nav .list-item [href*="discover"]');
  });
  andThen(function() {
    assert.equal(currentURL(), '/discover/start');
  });
});

test('can visit discover from the home page', function(assert) {
  server.create('djangoPage', {id:'/'});
  visit('/');
  andThen(function() {
    click('.l-page-nav .list-item [href*="discover"]');
  });
  andThen(function() {
    click('button:contains("Get Started")');
  });
  andThen(function() {
    assert.equal(currentURL(), '/discover/playlist');
  });
});

test('it automatically selects all topics', function(assert) {
  server.create('djangoPage', {id:'/'});
  server.createList('discover-topic', 20);
  visit('/');
  andThen(function() {
    click('.l-page-nav .list-item [href*="discover"]');
  });
  andThen(function() {
    click('button:contains("Get Started")');
  });
  andThen(function() {
    click('a:contains("Edit My Shows & Topics")');
  });
  andThen(function() {
    click('a:contains("Pick Topics")');
  });
  andThen(function() {
    assert.equal($('.discover-topic.is-selected').length, 20, 'it should select all discover topics');
  });
});
