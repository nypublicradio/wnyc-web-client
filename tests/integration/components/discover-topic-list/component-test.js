import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('discover-topic-list', 'Integration | Component | discover topic list', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {
  this.set('topics', server.createList('discover-topic', 20));
  this.render(hbs`{{discover-topic-list topics=topics}}`);
  assert.equal(this.$('.discover-topic').length, 20);
});
