import $ from 'jquery';
import { click, currentURL, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession } from 'ember-simple-auth/test-support';
import config from 'wnyc-web-client/config/environment';
import velocity from 'velocity';

module('Acceptance | discover', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    velocity.mock = true;
    window.Modernizr.touchevents = false;
    let session = currentSession();
    session.set('data.discover-excluded-shows',  []);
    session.set('data.discover-topics', []);
    session.set('data.discover-excluded-story-ids', []);
    server.create('stream');
  });

  hooks.afterEach(function() {
    velocity.mock = false;
  });

  skip('can visit discover from the home page', async function(assert) {
    withFeature('discover');
    server.create('djangoPage', {id:'/'});
    await visit('/');

    await click('.l-page-nav .list-item [href*="discover"]');

    assert.equal(currentURL(), '/discover/start');
  });

  skip('first-time users are redirected /discover -> /discover/start', async function(assert) {
    await visit('/discover');

    assert.equal(currentURL(), '/discover/start', 'should be on start page');
  });

  skip('button exists to create new discover station', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');

    assert.equal(currentURL(), '/discover/start/topics');
  });

  skip('shows list of topics', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');
    assert.equal($(".discover-topic").length, 20);
  });

  skip('select all button selects all topics', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');
    assert.equal($(".discover-topic").length, 20);
    await click('button');
    assert.equal($(".discover-topic.is-selected").length, 20);
  });


  skip('next button is disabled until a topic is selected', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');
    assert.equal(currentURL(), '/discover/start/topics');
    assert.equal($('button.mod-filled-red').length, 0, "Button should not be red");
    await click(".discover-topic input");
    assert.equal($('button.mod-filled-red').length, 1, "Button should be red");
  });

  skip('next button shows an error if you click it without a topic selected', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');
    assert.equal(currentURL(), '/discover/start/topics');
    assert.equal($('.discover-setup-title-error').text().trim(), "");
    await click('button');
    assert.equal($('.discover-setup-title-error').text().length > 0, true);
  });

  skip('back goes back to the welcome screen', async function(assert) {
    await visit('/discover/start');
    server.createList('discover-topic', 20);

    await click('button');
    assert.equal(currentURL(), '/discover/start/topics');
    await click("button");
    assert.equal(currentURL(), '/discover/start');
  });

  skip('topics are saved in a session and maintained upon next visit in initial flow', async function(assert) {
    await visit('/discover/start');
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});

    await click('button');
    assert.equal(currentURL(), '/discover/start/topics', "is on topics");
    await click(".discover-topic input[name='music']");
    await click("button");
    assert.equal(currentURL(), "/discover/start/shows");
    await visit('/discover/start/topics');
    assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
    assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
    assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
  });

  skip('show exclusions are saved in a session and maintained upon next visit in initial flow', async function(assert) {
    server.createList('discover-topic', 5);
    let shows = server.createList('show', 5);
    let testShow = shows[0];
    await visit('/discover/start');
    await click('button');

    await click(".discover-topic input");
    await click("button");

    assert.equal(currentURL(), '/discover/start/shows');
    assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), true);
    await click(`.discover-show[data-slug="${testShow.slug}"]`);
    await click("button");

    await visit('/discover/start/shows');

    assert.equal($(`.discover-show[data-slug="${testShow.slug}"]`).length, 1);
    assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), false, "should not be checked");
  });

  skip('show exclusions are maintained if you go back to topics screen', async function(assert) {
    server.createList('discover-topic', 5);
    let shows = server.createList('show', 5);
    let testShow = shows[0];
    await visit('/discover/start');
    await click('button');
    await click(".discover-topic input");
    await click("button");
    assert.equal(currentURL(), '/discover/start/shows', "should be on shows step");
    assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), true, "show should be selected");
    await click(`.discover-show[data-slug="${testShow.slug}"]`);
    await click("button");
    await click("button");
    assert.equal($(`.discover-show[data-slug="${testShow.slug}"]`).length, 1, "test show should exist");
    assert.equal($(`.discover-show[data-slug="${testShow.slug}"] input`).prop('checked'), false, "should not be checked");
  });

  skip('all shows are selected by default', async function(assert) {
    server.createList('discover-topic', 5);
    let shows = server.createList('show', 5);
    await visit('/discover/start');
    await click('button');

    await click(".discover-topic input");
    await click("button");
    assert.equal(currentURL(), '/discover/start/shows');
    assert.equal($(`.discover-show input:checked`).length, shows.length, "all shows should be selected");
  });

  skip('create playlist button is disabled if no shows are selected', async function(assert) {
    server.createList('discover-topic', 20);
    server.createList('show', 2);

    await visit('/discover/start');

    await click('button');
    await click(".discover-topic input");
    await click("button");
    assert.equal($('button.mod-filled-red').length, 1, "Button should be red");

    await click($(".discover-show")[0]);
    await click($(".discover-show")[1]);

    assert.equal(currentURL(), '/discover/start/shows');
    assert.equal($('button.mod-filled-red').length, 0, "Button should not be red");
  });

  skip('create playlist button should show error if clicked if no shows are selected', async function(assert) {
    server.createList('discover-topic', 20);
    server.createList('show', 2);

    await visit('/discover/start');

    await click('button');
    await click(".discover-topic input");
    await click("button");

    assert.equal($(`.discover-show input:checked`).length, 2, "all shows should be selected");
    assert.equal($('button.mod-filled-red').length, 1, "Button should be red");

    await click($(".discover-show")[0]);
    await click($(".discover-show")[1]);

    await click($('button'));

    assert.equal($('.discover-setup-title-error').text().length > 0, true);
    assert.equal(currentURL(), '/discover/start/shows');
  });

  skip('playlist request sends stories and tags in correct format', async function(assert) {
    server.createList('discover-topic', 20);
    server.createList('show', 5);

    await visit('/discover/start');

    var done = assert.async();

    await click('button');
    await click($(".discover-topic input")[0]);
    await click($(".discover-topic input")[1]);
    await click($(".discover-topic input")[2]);

    await click("button");

    await click($(".discover-show")[0])
    await click($(".discover-show")[1]);
    await click($('button'));

    let url =[config.publisherAPI, 'v3/make_playlist'].join("/");
    server.get(url, function(schema, request) {
                let topics = server.db.discoverTopics.slice(0,3).mapBy('url').join(',');
                let shows = server.db.shows.slice(0,2).mapBy('slug').join(',');
                assert.equal(request.queryParams.tags, topics);
                assert.equal(request.queryParams.shows, shows);
                done();
              });
  });

  skip('setup picks up where you left off if you bail half way through', async function(assert) {
    server.createList('discover-topic', 5);
    server.createList('show', 5);

    await visit('/discover/start');
    await click('button');


    await click(".discover-topic input");
    await click("button");

    assert.equal(currentURL(), '/discover/start/shows');
    await click('a[href="/login"]');
    await click('.list-item a[href*="/discover"]');
    assert.equal(currentURL(), '/discover/start/shows', "should be on shows step");
  });

  skip('should be able to go back to welcome screen if you really want to', async function(assert) {
    server.createList('discover-topic', 5);
    server.createList('show', 5);

    await visit('/discover/start');
    await click('button');

    await click(".discover-topic input");
    await click("button");

    assert.equal(currentURL(), '/discover/start/shows');
    await click(".rounded-caps-button");
    assert.equal(currentURL(), '/discover/start/topics', "should be on topics screen");
    await click(".rounded-caps-button");
    assert.equal(currentURL(), '/discover/start', "should be on welcome screen");
  });

  skip('nav link sends you to start page', async function(assert) {
    withFeature('discover');
    server.createList('discover-topic', 5);
    server.createList('show', 5);
    server.create('djangoPage', {id:'/'});
    await visit('/');
    await click('.l-page-nav .list-item [href*="discover"]');

    assert.equal(currentURL(), '/discover/start', "should be on start page");
  });

  skip('mobile users get the app download page', async function(assert) {
    let oldTouchSetting = window.Modernizr.touchevents;
    window.Modernizr.touchevents = true; //spoof this thing
    server.createList('discover-topic', 5);
    await visit('/discover/start/topics');
    assert.equal(currentURL(), '/discover/start');
    assert.equal($("a").length, 1);
    window.Modernizr.touchevents = oldTouchSetting; // restore this thing
  });
});
