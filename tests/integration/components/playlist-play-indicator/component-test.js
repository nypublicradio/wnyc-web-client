import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | playlist play indicator', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{playlist-play-indicator}}`);
    assert.equal(findAll('button').length, 1);
  });

  test('play button is disabled when audio is not ready', async function(assert) {
    await render(hbs`{{playlist-play-indicator isReady=false}}`);
    assert.equal(this.$('button').is(":disabled"), true);
  });

  test('play button is enabled when audio is ready', async function(assert) {
    await render(hbs`{{playlist-play-indicator isReady=true}}`);
    assert.equal(this.$('button').is(":disabled"), false);
  });

  test('has data-is-playing attribute when audio is playing', async function(assert) {
    await render(hbs`{{playlist-play-indicator isPlaying=true}}`);
    assert.equal(findAll('[data-is-playing]').length, 1);
  });

  test('does not have data-is-playing attribute when audio is not playing', async function(assert) {
    await render(hbs`{{playlist-play-indicator isPlaying=false}}`);
    assert.equal(findAll('[data-is-playing]').length, 0);
  });

  test('sends pause action on click when playing', async function(assert) {
    assert.expect(1);

    this.set('actionFired', false);
    this.set('onPause', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{playlist-play-indicator isReady=true isPlaying=true onPause=(action onPause)}}`);
    await click('button');

    return settled().then(() => {
      assert.equal(this.get('actionFired'), true, "pause action should have fired");
    });
  });

  test('sends play action on click when paused', async function(assert) {
    assert.expect(1);

    this.set('actionFired', false);
    this.set('onPlay', () => {
      this.set('actionFired', true);
    });

    await render(hbs`{{playlist-play-indicator isReady=true isPlaying=false onPlay=(action onPlay)}}`);
    await click('button');

    return settled().then(() => {
      assert.equal(this.get('actionFired'), true, "play action should have fired");
    });
  });

  test('sends no action on click when not ready', async function(assert) {
    this.set('actionFired', false);
    this.set('onPlay', () => {
      this.set('actionFired', true);
    });

    this.set('onPause', () => {
      this.set('actionFired', true);
    });

    await render(
      hbs`{{playlist-play-indicator isReady=false isPlaying=true onPause=(action onPause) onPlay=(action onPlay)}}`
    );

    await click('button');

    return settled().then(() => {
      assert.equal(this.get('actionFired'), false, "no action should have fired");
    });
  });
});
