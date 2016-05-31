import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['aria-label', 'title', 'isCurrent:data-is-current', 'isPlaying:data-is-playing'],

  audio:        Ember.inject.service(),
  region:       'UnknownRegion',

  title:        Ember.computed('itemTitle', function() {
    return `Listen to ${this.get('itemTitle')}`;
  }),
  'aria-label': Ember.computed.alias('title'),

  disabled:     Ember.computed.not('audio.isReady'),
  isCurrent:    Ember.computed('audio.currentAudio.id', 'itemPK', function() {
    return this.get('itemPK') === this.get('audio.currentAudio.id');
  }),
  isPlaying:    Ember.computed.and('isCurrent', 'audio.isPlaying'),

  click() {
    if (this.get('isErrored')) {
      return;
    }
    let region = this.get('region');

    if (this.get('isPlaying')) {
      this.get('audio').pause(region);
    }
    else {
      this.get('audio').playOnDemand(this.get('itemPK'), this.elementId, region);
    }
  }
});
