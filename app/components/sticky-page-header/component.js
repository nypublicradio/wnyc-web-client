import Component from 'ember-component';
import { htmlSafe } from 'ember-string';
import computed from 'ember-computed';


export default Component.extend({
  use: 'top', // use the top scroll point by default
  offset() {
    return -this.element.clientHeight;
  },
  spacerHeight: 0,
  
  spacerStyle: computed('spacerHeight', function() {
    return htmlSafe(`height: ${this.get('spacerHeight')}px;`);
  }),
  
  willUpdate() {
    let height = this.$('.sticky-page-header').height();
    if (!this.get('sticky')) {
      height = 0;
    }
    this.set('spacerHeight', height);
  },
  
  actions: {
    topScrollPointReached(direction) {
      if (this.get('use') === 'top') {
        this.set('sticky', direction === 'down');
      }
    },
    bottomScrollPointReached(direction) {
      if (this.get('use') === 'bottom') {
        this.set('sticky', direction === 'down');
      }
    }
  },
});
