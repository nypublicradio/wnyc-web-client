import ListenButton from 'overhaul/components/listen-button/component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import hbs from 'htmlbars-inline-precompile';

function wnycEmbeddedAttr() {
  return computed('embeddedAttrs', {
    get(k) {
      return get(this, `embeddedAttrs.${k}`);
    },
    set(k, v) {
      return v;
    }
  });
}

export default ListenButton.extend({
  itemPK:       wnycEmbeddedAttr(),
  itemTitle:    wnycEmbeddedAttr(),
  duration:     wnycEmbeddedAttr(),
  playContext:  wnycEmbeddedAttr(),
  type:         wnycEmbeddedAttr(),

  state: computed('currentAudio', 'playState', 'itemPK', function() {
    if (this.get('currentAudio') === this.get('itemPK')) {
      return this.get('playState');
    }
  }),

  layout: hbs`
    {{listen-button.ui type=type}}
    {{#if (eq type 'blue-boss')}}Listen <span class="text--small dimmed">{{duration}}</span>{{/if}}`
});
