import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-show-list'],

  initialize: Ember.on('init', function() {
    this.updateShows();
  }),

  updateShows() {
    Ember.run.once(() => {
      this.sendAction('onShowsUpdated', this.get('selectedShows'));
    });
  },

  actions: {
    onMultiselectChangeEvent(selectedShows, changedShows, action) {
      if (action === 'added') {
        this.get('selectedShows').addObject(changedShows);
      }
      else if (action === 'removed') {
        this.get('selectedShows').removeObject(changedShows);
      }
      this.updateShows();
    }
  }
});
