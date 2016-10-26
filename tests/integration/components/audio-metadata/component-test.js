import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setBreakpointForIntegrationTest } from 'overhaul/tests/helpers/responsive';


moduleForComponent('persistent-player.audio-metadata', 'Integration | Component | audio metadata', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{persistent-player.audio-metadata}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it displays ondemand story metadata', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');
  let onDemandStory = {
    headers: { brand: {title: 'The Show'}},
    title: 'The Story'
  };
  this.set('currentAudio', onDemandStory);
  this.render(hbs`{{persistent-player.audio-metadata currentAudio=currentAudio media=media}}`);

  const expected = 'The Show - The Story';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
});

test('it reverses metadata order on small screens', function(assert) {
  setBreakpointForIntegrationTest(this, 'smallOnly');
  let onDemandStory = {
    headers: { brand: {title: 'The Show'}},
    title: 'The Story'
  };
  this.set('currentAudio', onDemandStory);
  this.render(hbs`{{persistent-player.audio-metadata currentAudio=currentAudio media=media}}`);

  const expected = 'The Story - The Show';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
});

test('it displays stream story metadata correctly', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');
  let streamShow = {
    currentShow: {
      showTitle: 'The Show',
      episodeTitle: 'The Episode'
    }
  };
  this.set('currentAudio', streamShow);
  this.render(hbs`{{persistent-player.audio-metadata currentAudio=currentAudio media=media}}`);

  const expected = 'The Show - The Episode';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
});

test('it displays stream song metadata correctly', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');
  let streamSong = {
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
  this.set('currentAudio', streamSong);
  this.render(hbs`{{persistent-player.audio-metadata currentAudio=currentAudio media=media}}`);

  const expected = 'The Song Show - title, composer, musician (instrument)';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
});

test('it renders html tags in metadata', function(assert) {
  setBreakpointForIntegrationTest(this, 'mediumAndUp');
  let onDemandStory = {
    headers: { brand: {title: 'The <em>New</em> Show'}},
    title: 'The <strong>Big</strong> Story'
  };
  this.set('currentAudio', onDemandStory);
  this.render(hbs`{{persistent-player.audio-metadata currentAudio=currentAudio media=media}}`);

  const expected = 'The New Show - The Big Story';
  const actual = this.$().text().trim().replace(/\s+/g,' ');

  assert.equal(actual, expected);
  assert.equal(this.$('em').length, 1);
  assert.equal(this.$('strong').length, 1);
});
