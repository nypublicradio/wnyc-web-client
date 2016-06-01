import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-playlist-story', 'Integration | Component | discover playlist story', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{discover-playlist-story}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#discover-playlist-story}}
      template block text
    {{/discover-playlist-story}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
