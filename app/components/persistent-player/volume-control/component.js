import get from 'ember-metal/get';
import { isEmpty } from 'ember-utils';
import Component from 'ember-component';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  classNames: 'volume',
  classNameBindings: ['isMuted'],
  volumeInPercent: computed('volume', 'isMuted', {
    get() {
      if (get(this, 'isMuted')) {
        return 0;
      }
      return get(this, 'volume');
    },
    set(k, v) {
      return v;
    }
  }),
  trackWidth: computed('volumeInPercent', function() {
    return htmlSafe(`width: ${get(this, 'volumeInPercent')}%;`);
  }),
  handlePosition: computed('volumeInPercent', function() {
    return htmlSafe(`left: ${get(this, 'volumeInPercent')}%;`);
  }),
  click({target, pageX}) {
    this._setVolume(target, pageX);
  },
  mouseDown(e) {
    if (window.getSelection && window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
    if (e.target.classList.includes('volume-slider-handle')) {
      this.$().on('mousemove', '.volume-slider', this.click.bind(this));
    }
  },
  mouseUp() {
    this.$().off('mousemove', '.progress-wrapper');
  },
  mouseLeave() {
    this.$().off('mousemove', '.progress-wrapper');
  },
  _setVolume(target, x) {
    if (!isEmpty(this.$(target).closest('.volume-slider'))) {
      let $controls = this.$('.volume-slider');
      let offset = $controls.offset();
      let leftLimit = offset.left;
      let rightLimit = offset.left + $controls.width();
      let p;
      if (x < leftLimit) {
        p = 0;
      } else if (x > rightLimit) {
        p = 1;
      } else {
        p = (x - leftLimit) / $controls.width();
      }
      get(this, 'setVolume')(p * 100);
    }
  },
  actions: {
    toggleMute() {
      get(this, 'toggleMute')();
    }
  }
});
