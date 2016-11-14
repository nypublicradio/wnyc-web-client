import Component from 'ember-component';
import { htmlSafe } from 'ember-string';
import computed from 'ember-computed';

export default Component.extend({
  spacerHeight: '0px',
  
  spacerStyle: computed('spacerHeight', function() {
    return htmlSafe(`height: ${this.get('spacerHeight')};`);
  }),
  
  willUpdate() {
    let header = this.$('.sticky-page-header')[0];
    let height = window.getComputedStyle(header).height;
    if (!this.get('sticky')) {
      height = '0px';
    }
    this.set('spacerHeight', height);
  },
  
  actions: {
    trigger(direction) {
      let sticky = direction === 'down';
      this.set('sticky', sticky);
    },
  },
});
