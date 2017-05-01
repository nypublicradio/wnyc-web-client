import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import Test from 'ember-test';

moduleForAcceptance('Acceptance | analytics');

test('test for analytics selectors', function(assert) {
    
  Test.registerWaiter(function() {
    return find('.stream-banner-station').length;
  });
  server.create('bucket', {slug: 'wqxr-home'});
  server.createList('stream', 7);
  server.createList('whats-on', 7);
  
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    // UA, User clicks on a link in a homepage bucket
    let show = findWithAssert('.brick__item .item__head__brand').first();
    let overlayLink = findWithAssert('.brick__item .item__link--hidden').first();
    // let title = findWithAssert('.item__head__headline > a').first();
    
    // assert event values
    let firstStory = server.db.buckets[0].bucketItems[0].attributes;
    let shows = firstStory.headers.links.reverse().map(l => l.title).join(' | ');

    assert.equal(`${shows} | ${firstStory.title}`, overlayLink.attr('title'), 'link overlay should include analytics info');
    // assert.equal(`${shows} | ${firstStory.title}`, title.attr('title'), 'headline link should include analytics info');
    assert.equal(firstStory.headers.brand.title, show.attr('title'), 'show link should include analytics info');
  });
  
  andThen(function() {
    // UA, User Launches Stream from Stream Banner
    findWithAssert('.stream-banner__active-stream');
    click(findWithAssert('.stream-banner-listenbutton.is-paused'));
  });
  
  andThen(function() {
    // UA, User Pauses Listen Live from Stream Banner
    findWithAssert('.stream-banner-listenbutton.is-playing');
    
    // UA Pause Persistent Player
    let pauseButton = findWithAssert('.nypr-player-button.mod-listen.is-playing');
    assert.ok(pauseButton.attr('title'));
    
    // UA Fast forward from persistent player
    findWithAssert('.nypr-player-button.mod-fastforward');
    // UA Rewind from persistent player
    findWithAssert('.nypr-player-button.mod-rewind');
    
    click(pauseButton);
  });
  
  andThen(function() {
    let playButton = findWithAssert('.nypr-player-button.mod-listen.is-paused');
    assert.ok(playButton.attr('title'));
  });
  
  click('.sharebutton button');
  
  andThen(function() {
    // UA, User shares stream from persistent player
    findWithAssert('.sharebutton-listitem > button');
    // findWithAssert('.nypr-player-stream-info-station-info > a');
  });
  
  click('.ember-basic-dropdown-trigger');
  
  andThen(function() {
    // UA, User Selects a Station from Stream Banner Dropdown
    findWithAssert('.stream-banner-dropdown .ember-power-select-option');
  });
  
  andThen(function() {
    // UA Menu Social Links
    let socialLinks = findWithAssert('.sitechrome__nav-footer .nypr-social-icons__link');
    socialLinks.each(() => assert.ok(socialLinks.attr('title')));
  });
});
