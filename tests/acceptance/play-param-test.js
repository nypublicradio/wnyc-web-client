import {
  click,
  findAll,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { registerMockOnInstance } from 'wqxr-web-client/tests/helpers/register-mock';
import Service from '@ember/service';
import velocity from 'velocity';
import { dummyHifi } from 'wqxr-web-client/tests/helpers/hifi-integration-helpers';


velocity.mock = true;

const mockAudio = Service.extend({
  playParam: null,
  play(playParam) {
    this.set('playParam', playParam);
  }
});

module('Acceptance | play param', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
    registerMockOnInstance(this.application, 'service:hifi', dummyHifi);
  });

  skip('play param transitions', async function(assert) {
    let application = this.application;
    let audio = registerMockOnInstance(application, 'service:dj', mockAudio);

    server.create('django-page', {
      id: 'fake/',
      testMarkup: `
        <a href="/foo?play=wnyc-fm939" id="foo">foo</a>
      `
    });
    server.create('django-page', {
      id: 'foo/',
      testMarkup: `
        <a href="/fake" id="home">home</a>
      `
    });
    await visit('/fake');
    await click('#foo');

    assert.equal(currentURL(), '/foo?play=wnyc-fm939', 'url should have ?play');
    assert.equal(audio.get('playParam'), 'wnyc-fm939', 'play should be called');
    await click('#home');
    assert.equal(currentURL(), '/', 'homepage should not have a query param');
    assert.equal(audio.get('playParam'), 'wnyc-fm939', 'play should not be called again');
  });

  test('loading a page with the ?play param', async function(assert) {
    let slug = 'foo';

    server.create('story', {slug, title: 'Foo', audio: '/good/15000/1'});
    server.create('django-page', {id: `bar/`});

    await visit(`bar?play=${slug}`);

    assert.ok(findAll('.nypr-player').length, 'persistent player should be visible');
    assert.equal(find('[data-test-selector=nypr-player-story-title]').textContent, 'Foo', 'Foo story should be loaded in player UI');
  });

  test('loading a page with a bad ?play param', async function(assert) {
    let id = '1';
    server.create('django-page', {id: `/bar?play=${id}`});

    await visit(`bar?play=${id}`);
    assert.notOk(findAll('.nypr-player').length, 'persistent player should not be visible');
  });
});
