import Component from '@ember/component';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';

export default Component.extend({
  tagName: 'div',
  classNames: ['centennial-card'],
  attributeBindings: ['target', 'href', 'data-category', 'data-action', 'data-label'],
  url: computed('this.item', function() {
    return this.item.attributes.url
  }),
  title: computed('this.item', function() {
    return this.item.attributes.title
  }),
  image: computed('this.item', function() {
    return this.item.attributes.imageMain || this.item.attributes.image
  }),
  tease: computed('this.item', function() {
    return this.item.attributes.tease
  }),
  isStreamable: and('item.attributes.audioAvailable', 'item.attributes.audioMayStream'),
});
