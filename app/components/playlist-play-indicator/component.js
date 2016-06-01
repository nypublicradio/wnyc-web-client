import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['disabled', 'aria-label', 'title', 'isPlaying:data-is-playing'],

  title:        Ember.computed('itemTitle', function() {
    return `Listen to ${this.get('itemTitle')}`;
  }),
  'aria-label': Ember.computed.alias('title'),

  disabled:     Ember.computed.not('isReady'),
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
