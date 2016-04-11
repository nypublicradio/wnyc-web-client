import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('story-tease', 'Integration | Component | story tease', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    delete window.wnyc;
    server.shutdown();
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('item', {title: 'foo'});

  this.render(hbs`{{story-tease item=item}}`);

  assert.equal(this.$('[data-test-selector=story-tease-title]').text().trim(), 'foo');
});

test('listen and queue buttons open the pop up player', function(assert) {
  assert.expect(2);

  this.set('item', {id: 'foo'});

  window.wnyc = {};
  window.wnyc.xdPlayer = {
    playOnDemand(id) {
      assert.equal(id, 'foo', 'play button calls XD Player');
    },
    addToPlaylist(id) {
      assert.equal(id, 'foo', 'queue button calls XD Player');
    }
  };

  this.render(hbs`{{story-tease isListenableNow=true item=item}}`);
  this.$('[data-test-selector=listen-button]').click();
  this.$('[data-test-selector=queue-button]').click();
});
