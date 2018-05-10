import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setBreakpoint } from 'ember-responsive/test-support';
import DummyConnection from 'ember-hifi/hifi-connections/dummy-connection';

const setupHifi = app => {
  const HIFI = app.lookup('service:hifi');
  app.register('hifi-connection:local-dummy-connection', DummyConnection, {instantiate: false});
  HIFI.set('_connections', [HIFI._activateConnection({name: 'LocalDummyConnection'})]);
}

module('Acceptance | Selectors for GTM Analytics', function(hooks) {
  setupApplicationTest(hooks);

  function findWithAssert(selector){
    let found = findAll(selector);
    if (found.length == 0){
      throw "DOM element not found.";
    } else {
      return found;
    }
  }

  test('test for analytics selectors', async function(assert) {
    setupHifi(this.owner);
    setBreakpoint('largeAndUp')
    // registerWaiter(waitForStreams);

    server.create('bucket', {slug: 'wqxr-home'});
    server.createList('stream', 7);
    server.createList('whats-on', 7);

    await visit('/');

    // unregisterWaiter(waitForStreams);

    assert.equal(currentURL(), '/');
    // UA, User clicks on a link in a homepage bucket
    let show = findWithAssert('.brick__item .item__head__brand')[0];
    let overlayLink = findWithAssert('.brick__item .item__link--hidden')[0];
    // let title = findWithAssert('.item__head__headline > a').first();

    // assert event values
    let firstStory = server.db.buckets[0].bucketItems[0].attributes;
    let shows = firstStory.headers.links.reverse().map(l => l.title).join(' | ');

    assert.equal(`${shows} | ${firstStory.title}`, overlayLink.attributes.getNamedItem('title').value, 'link overlay should include analytics info');
    // assert.equal(`${shows} | ${firstStory.title}`, title.attr('title'), 'headline link should include analytics info');
    assert.equal(firstStory.headers.brand.title, show.attributes.getNamedItem('title').value, 'show link should include analytics info');
    // UA, User Launches Stream from Stream Banner
    findWithAssert('.stream-banner__active-stream');
    await click('.stream-banner-listenbutton');
    // UA, User Pauses Listen Live from Stream Banner
    findWithAssert('.stream-banner-listenbutton.is-playing');

    // UA Pause Persistent Player
    let pauseButton = findWithAssert('.nypr-player-button.mod-listen.is-playing')[0];
    assert.ok(pauseButton.attributes.getNamedItem('title').value);

    // UA Fast forward from persistent player
    findWithAssert('.nypr-player-button.mod-fastforward');
    // UA Rewind from persistent player
    findWithAssert('.nypr-player-button.mod-rewind');

    await click('.nypr-player-button.mod-listen.is-playing');
    let playButton = findWithAssert('.nypr-player-button.mod-listen.is-paused')[0];
    assert.ok(playButton.attributes.getNamedItem('title').value);
    await click('.nypr-sharebutton button');

    // UA, User shares stream from persistent player
    findWithAssert('.nypr-sharebutton-listitem > button');
    // findWithAssert('.nypr-player-stream-info-station-info > a');

    await click('.ember-basic-dropdown-trigger');

    // UA, User Selects a Station from Stream Banner Dropdown
    findWithAssert('.stream-banner-dropdown .ember-power-select-option');
    // UA Menu Social Links
    let socialLinks = findWithAssert('.sitechrome__nav-footer .nypr-social-icons__link');
    socialLinks.forEach((e) => assert.ok(e.attributes.getNamedItem('title').value));
  });
});
