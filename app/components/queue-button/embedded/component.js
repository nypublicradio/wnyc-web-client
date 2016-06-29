import QueueButton from 'overhaul/components/queue-button/component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import layout from 'overhaul/components/queue-button/template';

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

export default QueueButton.extend({
  itemPK:     wnycEmbeddedAttr(),
  itemTitle:  wnycEmbeddedAttr(),
  type:       wnycEmbeddedAttr(),
  region:     wnycEmbeddedAttr(),

  layout
});
