import Ember from 'ember';

export default Ember.Component.extend({
  use: 'top', // use the top scroll point by default
  offset: 0,

  onStickyChange: Ember.observer('sticky', function() {
    let height = this.$('.sticky-page-header').height();
    if (!this.get('sticky')) {
      height = 0;
    }
    this.$('.sticky-page-header-spacer').css('height', height);
  }),

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
  }
});
