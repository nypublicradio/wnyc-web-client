import Ember from 'ember';
const { Component, computed, get, set } = Ember;
const { htmlSafe } = Ember.String;

export default Component.extend({
  classNames: ['progress'],
  downloadedPercentage: computed('downloaded', function() {
    let downloaded = get(this, 'downloaded');
    return htmlSafe(`width: ${(downloaded) * 100}%;`);
  }),
  playedPercentage: computed('position', function() {
    let position = get(this, 'position');
    let duration = get(this, 'duration');
    return htmlSafe(`width: ${(position/duration) * 100}%;`);
  }),
  playheadPosition: computed('mousePosition', function() {
    let p = get(this, 'mousePosition');
    return htmlSafe(`left: ${p * 100}%;`);
  }),

  mousePosition: 0,

  mouseMove({target, pageX}) {
    let offset = this.$().offset();
    let p;
    if (pageX < offset.left) {
      p = 0;
    } else if (pageX > offset.left + this.$().width()) {
      p = 1;
    } else {
      p = (pageX - offset.left) / this.$().width();
    }

    set(this, 'mousePosition', p);
  },
  actions: {
    setPosition() {
      get(this, 'setPosition')(get(this, 'mousePosition'));
    }
  }
});
