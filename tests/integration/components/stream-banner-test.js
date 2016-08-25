import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stream-banner', 'Integration | Component | stream banner', {
  integration: true
});

// TODO: use mirage for this?
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

const streamTitleSelector = '.streambanner-station:first-child';
const streamDetailsSelector = '.streambanner-details';

test('it renders', function(assert) {
  this.render(hbs`{{stream-banner}}`);
  assert.equal(this.$('.streambanner-header').text().trim(), 'ON AIR NOW', 'it should render');
});

test('it displays the show title', function(assert) {
  this.set('stream', dummyStreamShowOnly);
  this.render(hbs`{{stream-banner stream=stream}}`);
  assert.equal(this.$(streamTitleSelector).text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the show title for streams with episodes', function(assert) {
  this.set('stream', dummyStreamShowWithEpisode);
  this.render(hbs`{{stream-banner stream=stream}}`);
  assert.equal(this.$(streamTitleSelector).text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the show title for streams with music', function(assert) {
  this.set('stream', dummyStreamShowWithMusic);
  this.render(hbs`{{stream-banner stream=stream}}`);
  assert.equal(this.$(streamTitleSelector).text().trim(), 'Show Title', 'it should display the show title');
});

test('it displays the episode title for streams with episodes', function(assert) {
  this.set('stream', dummyStreamShowWithEpisode);
  this.render(hbs`{{stream-banner stream=stream}}`);
  assert.equal(this.$(streamDetailsSelector).text().trim(), 'Episode Title', 'it should display the episode title');
});

test('it displays the song details for streams with music', function(assert) {
  this.set('stream', dummyStreamShowWithMusic);
  this.render(hbs`{{stream-banner stream=stream}}`);
  assert.equal(this.$(streamDetailsSelector).text().trim(), 'Song Title, Composer Name, Musician Name (Instrument)', 'it should display the song details');
});



