import { moduleForComponent, test } from 'ember-qunit';
import startMirage from 'wqxr-web-client/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';

const sessionStub = Ember.Service.extend({
  data: {
    'user-prefs-active-stream': {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
    'user-prefs-active-autoplay': 'default_stream'
  }
});

moduleForComponent('user-settings', 'Integration | Component | user settings', {
  integration: true,
  beforeEach() {
    this.register('service:session', sessionStub);
    this.inject.service('session');
    startMirage(this.container);
    server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' });
  },
  afterEach() {
    server.shutdown();
  }
});

test('it renders with being already authenticated', function(assert) {
  this.set('streams', [server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM', audioBumper: 'blerg' })]);
  this.render(hbs`{{user-settings streams=streams}}`);
  let activeStream = this.$('.user-stream .ember-power-select-selected-item').text().trim();
  assert.equal(activeStream, 'WNYC 93.9FM');

  let activePref = this.$('.autoplay-options .ember-power-select-selected-item').text().trim();
  assert.equal(activePref, 'My Default Stream');
});
