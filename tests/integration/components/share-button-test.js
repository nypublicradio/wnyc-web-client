import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { urlEncode } from 'overhaul/helpers/url-encode';

moduleForComponent('share-button', 'Integration | Component | share button', {
  integration: true
});

test('it renders', function(assert) {
  const expectedContents = ['Facebook', 'Twitter', 'Email'];
  this.render(hbs`{{share-button}}`);
  let actualContents = this.$().text().trim().split(/\s+/);
  assert.deepEqual(actualContents, expectedContents, 'it renders without a block');

  const expectedBlockContents = ['SHARE', 'Facebook', 'Twitter', 'Email'];
  this.render(hbs`
    {{#share-button}}
      SHARE
    {{/share-button}}
  `);
  let actualBlockContents = this.$().text().trim().split(/\s+/);
  assert.deepEqual(actualBlockContents, expectedBlockContents, 'it renders with a block');
});

test('it renders the correct number of links', function(assert) {
  const expectedLinkCount = 3;
  this.render(hbs`{{share-button}}`);
  let actualLinkCount = this.$('a').length;
  assert.equal(actualLinkCount, expectedLinkCount);
});

test('it has links to correct urls when passed a story object', function(assert) {
  this.set('story', {
    title: 'Cool Link',
    url: 'http://wnyc.org/story/cool-link'
  });
  let shareUrl = this.get('story.url');
  let shareText = this.get('story.title');
  const expectedUrls = [
    `https:\/\/www.facebook.com/sharer/sharer.php?u=${urlEncode(shareUrl)}`,
    `https:\/\/twitter.com/intent/tweet?url=${urlEncode(shareUrl)}&text=${urlEncode(shareText)}&via=WNYC`,
    `mailto:?subject=${urlEncode(shareText)}&body=${urlEncode(shareUrl)}`
  ];
  this.render(hbs`{{share-button story=story}}`);
  expectedUrls.forEach((expectedUrl, index) => {
    let actualUrl = this.$('a').eq(index).attr('href');
    assert.equal(actualUrl, expectedUrl);
  });
});

