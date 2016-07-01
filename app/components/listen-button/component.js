import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { readOnly, not, equal, match } from 'ember-computed';
import get from 'ember-metal/get';
import { htmlSafe } from 'ember-string';
import run from 'ember-runloop';

const STATES = {
  PLAYING:  'is-playing',
  PAUSED:   'is-paused',
  LOADING:  'is-loading'
};

export default Component.extend({
  audio:                service(),

  disabled:             not('audio.isReady'),
  isPlaying:            equal('state', STATES.PLAYING),
  isExpandable:         match('type', /(blue|gray)-(minion|boss)/),
  'aria-label':         readOnly('title'),
  'data-test-selector': 'listen-button',

  tagName:              'button',
  classNames:           ['listen-button'],
  classNameBindings:    ['isHovering', 'state', 'type'],
  attributeBindings:    ['aria-label', 'title', 'disabled', 'data-test-selector', 'style'],

  title: computed(function() {
    return `Listen to ${get(this, 'itemTitle')}`;
  }),
  style: computed('width', function() {
    return this.get('width') ? htmlSafe(`width: ${this.get('width')}px;`) : null;
  }),
  width: computed('state', '_contentWidth', function() {
    if (!this.element || !this.get('isExpandable')) {
      return false;
    }

    let state = this.get('state');
    if (state === STATES.PLAYING || state === STATES.LOADING) {
      return Math.ceil(this.element.getBoundingClientRect().height); // make it a circle, set width = height
    } else {
      return this.get('_contentWidth');
    }
  }),

  didUpdateAttrs({ oldAttrs, newAttrs }) {
    if (newAttrs.isLive && newAttrs.isLive.value) {
      run.schedule('afterRender', this, () => {
        let contentWidth = this.element.scrollWidth + parseInt(this.$().css('paddingLeft'), 10) + parseInt(this.$().css('paddingRight'), 10);
        this.set('_contentWidth', contentWidth);
      });
    }
  },
  didRender() {
    if (!this._rendered && this.get('isExpandable')) {
      this._rendered = true;
      let contentWidth = Math.ceil(this.element.getBoundingClientRect().width);
      run.schedule('afterRender', this, () => this.set('_contentWidth', contentWidth));
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
    this.set('isHovering', false);
  },
  mouseEnter() {
    this.set('isHovering', true);
  },
});
