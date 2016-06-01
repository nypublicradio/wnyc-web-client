import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-playlist-play-button', 'Integration | Component | discover playlist play button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{discover-playlist-play-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#discover-playlist-play-button}}
      template block text
    {{/discover-playlist-play-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
