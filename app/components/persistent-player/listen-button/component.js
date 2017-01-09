import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { readOnly, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  hifi:                 service(),
  disabled:             not('hifi.isReady'),
  'aria-label':         readOnly('title'),
  'data-test-selector': 'listen-button',

  tagName:              'button',
  classNames:           ['listen-button', 'white-hollow'],
  classNameBindings:    ['isHovering', 'state'],
  attributeBindings:    ['aria-label', 'title', 'disabled', 'data-test-selector'],

  title: computed('currentTitle', function() {
    return `Listen to ${get(this, 'currentTitle')}`;
  }),

  mouseLeave() {
    set(this, 'isHovering', false);
  },
  mouseEnter() {
    set(this, 'isHovering', true);
  },
});
