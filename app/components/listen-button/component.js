import Ember from 'ember';

function wnycEmbeddedAttr() {
  return Ember.computed('embeddedAttrs', {
    get(k) {
      return this.get(`embeddedAttrs.${k}`);
    },
    set(k, v) {
      return v;
    }
  });
}

export default Ember.Component.extend({
  audio: Ember.inject.service(),

  classNames: ['btn', 'btn--blue', 'btn--large'],
  tagName: '',
  itemPK: wnycEmbeddedAttr(),
  itemTitle: wnycEmbeddedAttr(),
  duration: wnycEmbeddedAttr(),
  actions: {
    listenOnDemand() {
      this.get('audio').playOnDemand(this.get('itemPK'));
    }
  }
});
