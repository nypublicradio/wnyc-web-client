import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setBreakpointForIntegrationTest } from 'overhaul/tests/helpers/responsive';

moduleForComponent('persistent-player.audio-metadata', 'Integration | Component | audio metadata', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{persistent-player.audio-metadata media=media}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it displays story title and show title for medium and up', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');

  this.set('storyTitle', "The Story");
  this.set('storyUrl', "http://thestory/");
  this.set('showTitle', "The Show");
  this.set('showUrl', "http://theshow/");

  this.render(hbs`{{persistent-player.audio-metadata showTitle=showTitle storyTitle=storyTitle showUrl=showUrl storyUrl=storyUrl media=media}}`);

  const expected = 'The Show - The Story';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected, "overall text should be the same");

  assert.equal(this.$('a')[0].href, 'http://theshow/');
  assert.equal(this.$('a')[0].innerHTML, 'The Show');

  assert.equal(this.$('a')[1].href, 'http://thestory/');
  assert.equal(this.$('a')[1].innerHTML, 'The Story');
});

test('it reverses metadata order on small screens', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('storyTitle', "The Story");
  this.set('storyUrl', "http://thestory/");
  this.set('showTitle', "The Show");
  this.set('showUrl', "http://theshow/");

  this.render(hbs`{{persistent-player.audio-metadata showTitle=showTitle storyTitle=storyTitle showUrl=showUrl storyUrl=storyUrl media=media}}`);

  const expected = 'The Story - The Show';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected, "overall text should be the same");

  assert.equal(this.$('a')[1].href, 'http://theshow/');
  assert.equal(this.$('a')[1].innerHTML, 'The Show');

  assert.equal(this.$('a')[0].href, 'http://thestory/');
  assert.equal(this.$('a')[0].innerHTML, 'The Story');
});

test('it displays song details as plain text', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');

  this.set('showTitle', "The Song Show");
  this.set('showUrl', "http://thesongshow/");
  this.set('songDetails', "title, composer, musician (instrument)");

  this.render(hbs`{{persistent-player.audio-metadata showTitle=showTitle showUrl=showUrl songDetails=songDetails media=media}}`);

  const expected = 'The Song Show - title, composer, musician (instrument)';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected, "overall text should be the same");

  assert.equal(this.$('a')[0].href, 'http://thesongshow/');
  assert.equal(this.$('a')[0].innerHTML, 'The Song Show');
});

test('it renders html tags in metadata', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');

  this.set('storyTitle', "The <strong>Big</strong> Story");
  this.set('showTitle', "The <em>New</em> Show");

  this.render(hbs`{{persistent-player.audio-metadata showTitle=showTitle storyTitle=storyTitle media=media}}`);

  const expected = 'The New Show - The Big Story';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
  assert.equal(this.$('em').length, 1);
  assert.equal(this.$('strong').length, 1);
});
