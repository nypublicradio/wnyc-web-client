import Component from 'ember-component';
import { htmlSafe } from 'ember-string';
import computed from 'ember-computed';


export default Component.extend({
  spacerHeight: 0,
  
  spacerStyle: computed('spacerHeight', function() {
    return htmlSafe(`height: ${this.get('spacerHeight')}px;`);
  }),
  offset: computed('sticky', function() {
    return this.get('sticky') ? -100 : -285;
  }),
  
  willUpdate() {
    let height = this.$('.sticky-page-header').height() + -this.get('offset');
    if (!this.get('sticky')) {
      height = 0;
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
