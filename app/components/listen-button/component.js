import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { readOnly, not, equal, match } from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import { htmlSafe } from 'ember-string';
import { schedule } from 'ember-runloop';

const STATES = {
  PLAYING:  'is-playing',
  PAUSED:   'is-paused',
  LOADING:  'is-loading'
};

export default Component.extend({
  audio:                service(),

  disabled:             not('audio.isReady'),
  isPlaying:            equal('state', STATES.PLAYING),
  isExpandable:         match('type', /(blue|gray|red)-(minion|boss)/),
  'aria-label':         readOnly('title'),
  'data-test-selector': 'listen-button',

  tagName:              'button',
  classNames:           ['listen-button'],
  classNameBindings:    ['isHovering', 'measurableState', 'type'],
  attributeBindings:    ['aria-label', 'title', 'disabled', 'data-test-selector', 'style'],

  title: computed(function() {
    return `Listen to ${get(this, 'itemTitle')}`;
  }),
  style: computed('width', function() {
    let width = get(this, 'width');
    return width ? htmlSafe(`width: ${width}px;`) : null;
  }),
  width: computed('measurableState', 'contentWidth', function() {
    if (!this.element || !get(this, 'isExpandable')) {
      return false;
    }

    let state = get(this, 'measurableState');
    if (state === STATES.PLAYING || state === STATES.LOADING) {
      return Math.ceil(this.element.getBoundingClientRect().height); // make it a circle, set width = height
    } else {
      return get(this, 'contentWidth');
    }
  }),
  measurableState: computed('state', 'wasMeasured', 'isExpandable', function() {
    let { state, wasMeasured, isExpandable } = getProperties(this, 'state', 'wasMeasured', 'isExpandable');
    if (isExpandable && !wasMeasured) {
      return (STATES.PAUSED); // consider paused until we measure so we get full width of paused state
    } else {
      return state;
    }
  }),
  didUpdateAttrs({ oldAttrs, newAttrs }) {
    if (newAttrs.isLive && newAttrs.isLive.value) {
      schedule('afterRender', this, () => {
        let contentWidth = this.element.scrollWidth + parseInt(this.$().css('paddingLeft'), 10) + parseInt(this.$().css('paddingRight'), 10);
        set(this, 'contentWidth', contentWidth);
      });
    }
  },
  didRender() {
    let { wasMeasured, isExpandable } = getProperties(this, 'wasMeasured', 'isExpandable');
    if (isExpandable && !wasMeasured) {
      schedule('afterRender', this, () => {
        let contentWidth = Math.ceil(this.element.getBoundingClientRect().width);
        set(this, 'wasMeasured', true);
        set(this, 'contentWidth', contentWidth);
      });
    }
  },
  click() {
    if (get(this, 'isErrored')) {
      return;
    }
    let playContext = get(this, 'playContext') || get(this, 'region');
    let audio = get(this, 'audio');
    if (get(this, 'isPlaying')) {
      audio.pause();
    } else {
      let pk = get(this, 'itemPK');
      audio.play(pk, playContext);
    }
  },
  mouseLeave() {
    set(this, 'isHovering', false);
  },
  mouseEnter() {
    set(this, 'isHovering', true);
  },
});
