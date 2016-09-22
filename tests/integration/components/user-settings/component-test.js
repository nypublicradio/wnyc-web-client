import { moduleForComponent, test } from 'ember-qunit';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('user-settings', 'Integration | Component | user settings', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
    server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM' });
  }
});

test('it renders with being already authenticated', function(assert) {
  this.set('streams', [server.create('stream', { slug: 'wnyc-fm939', name: 'WNYC 93.9FM' })]);
  this.render(hbs`{{user-settings streams=streams}}`);
  let activeStream = this.$('.user-stream .ember-power-select-selected-item').text().trim();
  assert.equal(activeStream, 'WNYC 93.9FM');

  let activePref = this.$('.autoplay-options .ember-power-select-selected-item').text().trim();
  assert.equal(activePref, 'My Default Stream');
});
