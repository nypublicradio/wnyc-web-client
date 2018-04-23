import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import startMirage from 'wqxr-web-client/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

const sessionStub = Service.extend({
  data: {
    'user-prefs-active-stream': {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
    'user-prefs-active-autoplay': 'default_stream'
  }
});

module('Integration | Component | user settings', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
    this.session = this.owner.lookup('service:session');
    startMirage(this.container);
    server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('it renders with being already authenticated', async function(assert) {
    this.set('streams', [server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' })]);
    await render(hbs`{{user-settings streams=streams}}`);
    let activeStream = find('.user-stream .ember-power-select-selected-item').textContent.trim();
    assert.equal(activeStream, 'WNYC 93.9FM');
  });
});
