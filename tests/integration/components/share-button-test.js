import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import { urlEncode } from 'wnyc-web-client/helpers/url-encode';
import { shareMetadata } from 'wnyc-web-client/helpers/share-metadata';

moduleForComponent('share-button', 'Integration | Component | share button', {
  integration: true
});

let exampleStory = {
  title: 'Cool Link',
  url: 'http://wnyc.org/story/cool-link',
  analyticsCode: '123',
};
exampleStory.shareMetadata = shareMetadata(exampleStory);

let exampleStream = {
  audioType: 'livestream',
  currentShow: {
    title: 'Cool Show',
    url: 'http://wync.org/shows/cool-show'
  }
};
exampleStream.shareMetadata = shareMetadata(exampleStream);

test('it renders', function(assert) {
  this.render(hbs`{{share-button}}`);
  let actualContents = this.$().text().trim().split(/\s+/);
  const expectedContents = ['Facebook', 'Twitter', 'Email'];
  assert.deepEqual(actualContents, expectedContents, 'it should render the expected text');
});

test('it renders the correct number of links', function(assert) {
  const expectedLinkCount = 3;
  this.render(hbs`{{share-button}}`);
  let actualLinkCount = this.$('.sharebutton-listitem').length;
  assert.equal(actualLinkCount, expectedLinkCount);
});

test('email link has correct url when passed a story object', function(assert) {
  let story = exampleStory;
  this.set('story', story);
  this.render(hbs`{{share-button story=story}}`);

  let actualUrl = this.$('a').attr('href');
  let {shareText, shareUrl} = shareMetadata(story);
  const expectedUrl = `mailto:?subject=${urlEncode(shareText)}&body=${urlEncode(shareUrl)}`;
  assert.equal(actualUrl, expectedUrl);
});

test('email link has correct url when passed a stream object', function(assert) {
  let story = exampleStream;
  this.set('story', story);
  this.render(hbs`{{share-button story=story}}`);

  let actualUrl = this.$('a').attr('href');
  let {shareText, shareUrl} = shareMetadata(story);
  const expectedUrl = `mailto:?subject=${urlEncode(shareText)}&body=${urlEncode(shareUrl)}`;
  assert.equal(actualUrl, expectedUrl);
});

test('buttons send correct analytics values when clicked with a story', function(assert) {
  let story = exampleStory;
  let type = 'on_demand';
  let trackedEvents = [];
  let region = 'testZone';
  let mockMetrics = {
    trackEvent(service, trackingObject) {
      trackedEvents.push(trackingObject);
    }
  };

  this.set('metrics', mockMetrics);
  this.set('region', region);
  this.set('story', story);
  this.set('type', type);
  this.render(hbs`{{share-button story=story metrics=metrics region=region type=type}}`);

  let {shareText, analyticsCode} = shareMetadata(story);
  const expectedFacebookEvent = {
    category: 'Persistent Player',
    action: `Shared Story "${shareText}"`,
    label: `${region}|${analyticsCode}|${type}|Facebook`,
  };
  const expectedTwitterEvent = {
    category: 'Persistent Player',
    action: `Shared Story "${shareText}"`,
    label: `${region}|${analyticsCode}|${type}|Twitter`,
  };

  this.$('button:contains(Facebook)')[0].click();
  this.$('button:contains(Twitter)')[0].click();
  assert.equal(trackedEvents.length, 2, 'should send the correct number of tracking events');
  assert.deepEqual(trackedEvents[0], expectedFacebookEvent, 'should send the correct event for Facebook button');
  assert.deepEqual(trackedEvents[1], expectedTwitterEvent, 'should send the correct event for Twitter button');
  // link handler handles analytics for email sharing link
});

test('buttons send correct analytics values when clicked with a stream', function(assert) {
  let story = exampleStream;
  let type = 'livestream';
  let region = 'testZone';
  let trackedEvents = [];
  let mockMetrics = {
    trackEvent(service, trackingObject) {
      trackedEvents.push(trackingObject);
    }
  };

  this.set('metrics', mockMetrics);
  this.set('region', region);
  this.set('story', story);
  this.set('type', type);
  this.render(hbs`{{share-button story=story metrics=metrics region=region type=type}}`);

  let {shareText, analyticsCode} = shareMetadata(story);
  const expectedFacebookEvent = {
    category: 'Persistent Player',
    action: `Shared Story "${shareText}"`,
    label: `${region}|${analyticsCode}|${type}|Facebook`,
  };
  const expectedTwitterEvent = {
    category: 'Persistent Player',
    action: `Shared Story "${shareText}"`,
    label: `${region}|${analyticsCode}|${type}|Twitter`,
  };

  this.$('button:contains(Facebook)')[0].click();
  this.$('button:contains(Twitter)')[0].click();
  assert.equal(trackedEvents.length, 2, 'should send the correct number of tracking events');
  assert.deepEqual(trackedEvents[0], expectedFacebookEvent, 'should send the correct event for Facebook button');
  assert.deepEqual(trackedEvents[1], expectedTwitterEvent, 'should send the correct event for Twitter button');
  // link handler handles analytics for email sharing link
});

test('it closes the popup when you click a share button', function(assert) {
    assert.expect(2);
    let story = exampleStory;
    this.set('story', story);
    this.render(hbs`{{share-button story=story}}`);
    this.$('.popupmenu-button')[0].click();

    wait().then(() => {
      assert.ok($('.popupmenu').hasClass('is-open'), 'popup menu should open after you click the share button');
      this.$('button:contains(Facebook)')[0].click();
    });

    return wait().then(() => {
      assert.notOk($('.popupmenu').hasClass('is-open'), 'popup menu should close after you click the Facebook button');
    });
});
