import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import { faker } from 'ember-cli-mirage';

moduleForComponent('story-tease', 'Integration | Component | story tease', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    server.shutdown();
  }
});

const item = {
  title: 'foo',
  url: 'story/foo',
  tease: 'foo tease',
  audioDurationReadable: '1 min',
  dateLineDatetime: new Date(),
  imageMain: {template: faker.internet.avatar()},
  headers: {
    links: [{url: 'foo-link', title: 'foo link'}, {url: 'bar-link', title: 'bar link'}],
    brand: {title: 'Foo Show'}
  }
};

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('item', item);

  this.render(hbs`{{story-tease item=item}}`);

  assert.equal(this.$('[data-test-selector=story-tease-title]').text().trim(), 'foo');
  assert.ok(this.$('a[href="foo-link"]').length, 'header links are rendered');

  this.render(hbs`{{story-tease item=item parentTitle='Foo Show'}}`);
  assert.notOk(this.$('a[href="foo-link"]').length, 'header links are not rendered');
});
