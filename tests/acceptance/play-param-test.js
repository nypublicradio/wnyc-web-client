import { test, skip } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import { registerMockOnInstance } from 'wqxr-web-client/tests/helpers/register-mock';
import Service from 'ember-service';
import { resetHTML } from 'wqxr-web-client/tests/helpers/html';
import velocity from 'velocity';

velocity.mock = true;

const mockAudio = Service.extend({
  playParam: null,
  play(playParam) {
    this.set('playParam', playParam);
  }
});

moduleForAcceptance('Acceptance | play param', {
  beforeEach() {
    server.create('stream');
  },
  afterEach() {
    resetHTML();
  }
});

skip('play param transitions', function(assert) {
  let application = this.application;
  let audio = registerMockOnInstance(application, 'service:audio', mockAudio);

  server.create('django-page', {
    id: '/',
    testMarkup: `
      <a href="/foo?play=wnyc-fm939" id="foo">foo</a>
    `
  });
  server.create('django-page', {
    id: 'foo/',
    testMarkup: `
      <a href="/" id="home">home</a>
    `
  });
  visit('/');
  click('#foo');

  andThen(() => {
    assert.equal(currentURL(), '/foo?play=wnyc-fm939', 'url should have ?play');
    assert.equal(audio.get('playParam'), 'wnyc-fm939', 'play should be called');
    click('#home');
  });

  andThen(() => {
    assert.equal(currentURL(), '/', 'homepage should not have a query param');
    assert.equal(audio.get('playParam'), 'wnyc-fm939', 'play should not be called again');
  });
});

test('loading a page with the ?play param', function(assert) {
  let id = '123';

  server.create('story', {id, title: 'Foo'});
  server.create('django-page', {id: `bar/`});

  visit(`bar?play=${id}`);

  andThen(() => {
    assert.ok(Ember.$('.nypr-player').length, 'persistent player should be visible');
    assert.equal(Ember.$('[data-test-selector=nypr-player-story-title]').text(), 'Foo', 'Foo story should be loaded in player UI');
  });
});

test('loading a page with a bad ?play param', function(assert) {
  let id = '1';
  server.create('django-page', {id: `/bar?play=${id}`});

  visit(`bar?play=${id}`);
  andThen(() => {
    assert.notOk(Ember.$('.nypr-player').length, 'persistent player should not be visible');
  });
});
