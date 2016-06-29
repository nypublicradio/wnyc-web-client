import Component from 'ember-component';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const stub = Component.extend({
  layout: hbs`{{text}}`,
});

moduleForComponent('text-crawl', 'Integration | Component | text crawl', {
  integration: true,
  beforeEach() {
    this.register('component:test-stub', stub);
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{text-crawl}}`);

  assert.ok(this.$('.text-crawl-scroll').length);

  // Template block usage:
  this.render(hbs`
    {{#text-crawl}}
      template block text
    {{/text-crawl}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it updates the isScrolling property if text is too long', function(assert) {
  assert.expect(1);

  this.set('longText', Array(10000).join('foo'));
  this.render(hbs`
    {{#text-crawl watch=longText}}
      {{longText}}
    {{/text-crawl}}
  `);

  assert.ok(this.$().find('.is-scrolling').length, 'animation has begun');
});
