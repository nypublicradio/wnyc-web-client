import { alias, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['disabled', 'aria-label', 'title', 'isPlaying:data-is-playing'],

  title:        computed('itemTitle', function() {
    return `Listen to ${this.get('itemTitle')}`;
  }),
  'aria-label': alias('title'),

  disabled:     not('isReady'),
  isReady:      false,
  isPlaying:    false,

  click() {
    if (!this.get('isReady')) {
      return;
    }
    
    if (this.get('isPlaying')) {
      this.sendAction('onPause');
    }
    else {
      this.sendAction('onPlay');
    }
  }
});
