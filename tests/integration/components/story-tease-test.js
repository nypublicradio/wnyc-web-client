import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';
import { faker } from 'ember-cli-mirage';

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

const item = {
  title: 'foo',
  url: 'story/foo',
  tease: 'foo tease',
  audioDurationReadable: '1 min',
  dateLine: new Date(),
  imageMain: {template: faker.internet.avatar()},
  headers: {links: [{url: 'foo-link', title: 'foo link'}, {url: 'bar-link', title: 'bar link'}]}
};

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('item', item);

  this.render(hbs`{{story-tease item=item}}`);

  assert.equal(this.$('[data-test-selector=story-tease-title]').text().trim(), 'foo');
  assert.ok(this.$('a[href="foo-link"]').length, 'header links are rendered');

  this.render(hbs`{{story-tease item=item hideLinks=true}}`);
  assert.notOk(this.$('a[href="foo-link"]').length, 'header links are not rendered');
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
