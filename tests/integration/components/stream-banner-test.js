import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setBreakpointForIntegrationTest } from 'overhaul/tests/helpers/responsive';


moduleForComponent('stream-banner', 'Integration | Component | stream banner', {
  integration: true
});

// TODO: use mirage for this
const dummyStreamShowWithEpisode = {
  id:   "slug",
  slug: "slug",
  name: "Station Name",
  shortDescription: "Station Description",
  currentShow: {
    episodeTitle: "Episode Title",
    episodeUrl:   "http://www.example.org/episode",
    showTitle: "Show Title",
    showUrl:   "http://www.example.org/show",
    title: "Episode Title",
    url:   "http://www.example.org/episode"
  },
  currentStory: {
    title: "Episode Title",
    url:   "http://www.example.org/episode"
  }
};

const dummyStreamShowWithMusic = {
  id:   'slug',
  slug: 'slug',
  name: "Station Name",
  shortDescription: "Station Description",
  currentShow: {
    episodeTitle: null,
    episodeUrl:   null,
    showTitle: "Show Title",
    showUrl:   "http://www.example.org/show",
    title: "Show Title",
    url:   "http://www.example.org/show"
  },
  currentPlaylistItem: { catalogEntry: {
    title: "Song Title",
    composer: {
      name: "Composer Name"
    },
    soloists: [{
      musician: {
        name: "Musician Name"
      },
      instruments: ["Instrument"]
    }],
  }}
};

const dummyStreamShowOnly = {
  id:   "slug",
  slug: "slug",
  name: "Station Name",
  shortDescription: "Station Description",
  currentShow: {
    episodeTitle: null,
    episodeUrl:   null,
    showTitle: "Show Title",
    showUrl:   "http://www.example.org/show",
    title: "Show Title",
    url:   "http://www.example.org/show"
  }
};

test('it renders on smallOnly breakpoint', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.render(hbs`{{stream-banner media=media}}`);
  assert.equal(this.$('.streambanner-header').text().trim(), 'ON AIR NOW', 'it should render on small breakpoint');
});

test('it does not render on mediumAndUp breakpoint', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');
  this.render(hbs`{{stream-banner media=media}}`);
  assert.notOk(this.$('.streambanner-header').text().trim(), 'ON AIR NOW', 'it should not render on the mediumAndUp breakpoint');
});

test('it displays the show title', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('stream', dummyStreamShowOnly);
  this.render(hbs`{{stream-banner media=media stream=stream}}`);
  assert.equal(this.$('.streambanner-station:first:child').text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the show title for streams with episodes', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('stream', dummyStreamShowWithEpisode);
  this.render(hbs`{{stream-banner media=media stream=stream}}`);
  assert.equal(this.$('.streambanner-station:first:child').text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the show title for streams with music', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('stream', dummyStreamShowWithMusic);
  this.render(hbs`{{stream-banner media=media stream=stream}}`);
  assert.equal(this.$('.streambanner-station:first:child').text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the episode title for streams with episodes', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('stream', dummyStreamShowWithEpisode);
  this.render(hbs`{{stream-banner media=media stream=stream}}`);
  assert.equal(this.$('.streambanner-details').text().trim(), 'Episode Title', 'it should display the episode title');
});

test('it displays the song details for streams with music', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  this.set('stream', dummyStreamShowWithMusic);
  this.render(hbs`{{stream-banner media=media stream=stream}}`);
  assert.equal(this.$('.streambanner-details').text().trim(), 'Song Title', 'it should display the song details');
});



