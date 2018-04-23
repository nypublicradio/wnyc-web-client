import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'a',
  classNames: ['story-card'],
  attributeBindings: ['target', 'href', 'data-action', 'data-label'],
  target: computed('href', function() {
    let url = this.get('href');
    url = new URL(url);
    return url.origin !== location.origin ? '_blank' : null
  })
});
