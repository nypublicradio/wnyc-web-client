import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
const TOOLTIP_ID = 'tool1';

export default Component.extend({
  tooltipIsOpen: false,
  buttonAriaExpanded: readOnly('tooltipIsOpen'),
  buttonAriaDescribedBy: computed('tooltipIsOpen', function() {
    return this.tooltipIsOpen ? TOOLTIP_ID : '';
  }),
  tooltipClass: computed('tooltipIsOpen', function() {
    return this.tooltipIsOpen ? 'mod-visible' : 'mod-hidden';
  }),

  actions: {
    toggleTooltip() {
      if (!this.tooltipIsOpen) {
        set(this, 'tooltipIsOpen', true);
      } else {
        set(this, 'tooltipIsOpen', false);
      }
    }
  }
});
