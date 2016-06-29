import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tabbed-list', 'Integration | Component | tabbed list', {
  integration: true,
  beforeEach() {
    this.register('template:components/first-tab', hbs`<div class="first-tab"></div>`);
    this.register('template:components/second-tab', hbs`<div class="second-tab"></div>`);
    this.register('template:components/third-tab', hbs`<div class="third-tab"></div>`);
    this.set('titles', ['First', 'Second', 'Third']);
    this.set('components', ['first-tab', 'second-tab', 'third-tab']);
    this.set('animations', this.container.lookup('service:liquid-fire-transitions'));
  }
});

test('starts with first tab active', function(assert) {
  this.render(hbs`{{tabbed-list tabTitles=titles childComponents=components}}`);
  assert.equal(this.$('.is-active').text().trim(), 'First', 'First tab is active');
  assert.equal(this.$('.first-tab:visible').length, 1, 'First tab is visible');
  assert.equal(this.$('.second-tab:visible').length, 0, 'Second tab is not visible');
});

test('can switch to second tab', function(assert) {
  this.render(hbs`{{tabbed-list tabTitles=titles childComponents=components}}`);
  this.$('button:contains(Second)')[0].click();
  return this.get('animations').waitUntilIdle().then(() => {
    assert.equal(this.$('.is-active').text().trim(), 'Second', 'Second tab is active');
    assert.equal(this.$('.first-tab:visible').length, 0, 'First tab is not visible');
    assert.equal(this.$('.second-tab:visible').length, 1, 'Second tab is visible');
  });
});
