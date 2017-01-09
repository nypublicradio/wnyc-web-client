import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setBreakpointForIntegrationTest } from 'overhaul/tests/helpers/responsive';


const sessionStub = Ember.Service.extend({
  data: {
    'user-prefs-active-stream': {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
    'user-prefs-active-autoplay': 'default_stream'
  }
});
const bumperStub = Ember.Service.extend({
  revealNotificationBar: false
});

moduleForComponent('nypr-player-integration', 'Integration | Component | nypr player integration', {
  integration: true,
  beforeEach() {
    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session' });

    this.register('service:bumper-state', bumperStub);
    this.inject.service('bumper', { as: 'bumper-state' });
  },
  afterEach() {

  }
});

const streamSong = {
  currentShow: {
    showTitle: 'The Song Show'
  },
  currentPlaylistItem: {
    catalogEntry: {
      title: "title",
      composer: {
        name: "composer"
      },
      soloists: [{
        musician: {
          name: "musician"
        },
        instruments: ["instrument"]
      }]
    }
  }
};

const onDemandStory = {
  headers: { brand: {title: 'The Show', url: 'http://showurl'}},
  title: 'The Story',
  url: 'http://ondemandstoryurl'
};

const streamShow = {
  name: "WNYC 93.9 FM",
  id: 'streamid',
  playlistUrl: "http://playlisturl",
  scheduleUrl: "http://scheduleurl",
  currentShow: {
    showTitle: 'The Show',
    episodeTitle: 'The Episode',
    episodeUrl: 'http://episodeurl',
    showUrl: 'http://showurl'
  }
};

test('it renders nothing', function(assert) {
  this.render(hbs`{{nypr-player-integration}}`);
  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#nypr-player-integration}}
    {{/nypr-player-integration}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('it yields song metadata from current audio correctly', function(assert) {
  this.set('currentAudio', streamSong);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.songDetails}}
  {{/nypr-player-integration}}`);

  const expected = 'title, composer, musician (instrument)';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
});

test('it yields ondemand story title', function(assert) {
  this.set('currentAudio', onDemandStory);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.storyTitle}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Story");
});

test('it yields ondemand story url', function(assert) {
  this.set('currentAudio', onDemandStory);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.storyUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://ondemandstoryurl");
});

test('it yields ondemand show title', function(assert) {
  this.set('currentAudio', onDemandStory);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.showTitle}}
  {{/nypr-player-integration}}`);

  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Show");
});

test('it yields ondemand show url', function(assert) {
  this.set('currentAudio', onDemandStory);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.showUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://showurl");
});

test('it yields stream story title', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.storyTitle}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Episode");
});

test('it yields stream story url', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.storyUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://episodeurl");
});

test('it yields stream show title', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.showTitle}}
  {{/nypr-player-integration}}`);

  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Show");
});

test('it yields stream show url', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.showUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://showurl");
});

test('it yields ondemand currentTitle', function(assert) {
  this.set('currentAudio', onDemandStory);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.currentTitle}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Story");
});

test('it yields stream currentTitle', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.currentTitle}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "The Show on WNYC 93.9 FM");
});

test('it yields stream name', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.streamName}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "WNYC 93.9 FM");
});

test('it yields stream schedule url', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.streamScheduleUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://scheduleurl");
});

test('it yields stream playlist url', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.streamPlaylistUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "/streams/streamid");
});

test('it yields stream index url', function(assert) {
  this.set('currentAudio', streamShow);

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio media=media as |integration|}}
    {{integration.streamIndexUrl}}
  {{/nypr-player-integration}}`);


  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "/streams");
});

test('backdropImageUrl first choice is image', function(assert) {
  this.set('defaultImageUrl', 'http://default');
  this.set('currentAudio', {
    imageMain: {
      url: "http://firstchoice"
    },
    headers: {
      brand: {
        logoImage: {
          url: "http://secondchoice"
        }
      }
    }
  });

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio defaultImageUrl=defaultImageUrl media=media as |integration|}}
    {{integration.backdropImageUrl}}
  {{/nypr-player-integration}}`);

  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://firstchoice");
});

test('backdropImageUrl second choice is fallbackImage', function(assert) {
  this.set('defaultImageUrl', 'http://default');
  this.set('currentAudio', {
    imageMain: {
      url: null
    },
    headers: {
      brand: {
        logoImage: {
          url: "http://secondchoice"
        }
      }
    }
  });

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio defaultImageUrl=defaultImageUrl media=media as |integration|}}
    {{integration.backdropImageUrl}}
  {{/nypr-player-integration}}`);

  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://secondchoice");
});

test('backdropImageUrl last choice is defaultImageUrl', function(assert) {
  this.set('defaultImageUrl', 'http://default');
  this.set('currentAudio', {
    imageMain: {
      url: null
    },
    headers: {
      brand: {
        logoImage: {
          url: null
        }
      }
    }
  });

  this.render(hbs`{{#nypr-player-integration currentAudio=currentAudio defaultImageUrl=defaultImageUrl media=media as |integration|}}
    {{integration.backdropImageUrl}}
  {{/nypr-player-integration}}`);

  const actual = this.$().text().trim().replace(/\s+/g,' ');
  assert.equal(actual, "http://default");
});
