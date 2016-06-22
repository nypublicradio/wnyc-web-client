import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  classNames:['discover-show-list'],
  shows: [],
  selectedShows: [], // these are the models, and the multi-select checkbox
                     // component I used wants the models

  didReceiveAttrs() {
    this._super(...arguments);
    let selectedShowSlugs = this.get('selectedShowSlugs') || [];
    var selectedShows = [];
    if (selectedShowSlugs) {
      // Now we'll find the matching objects in the discover topics,
      // and add them to the selectedTopics list
      this.get('shows').forEach(function(show) {
        if (selectedShowSlugs.contains(get(show, 'slug'))) {
          selectedShows.addObject(show);
        }
      });
    }
    this.set('selectedShows', selectedShows);
  },

  initializeShows: Ember.on('init', function() {
    this.updateShows(this.get('selectedShows'));
  }),

  updateShows(shows) {
    Ember.run.once(() => {
      this.sendAction('onShowsUpdated', shows.mapBy('slug'));
    });
  },

  actions: {
    onMultiselectChangeEvent(selectedShows, changedShows, action) {
      let shows = this.get('selectedShows');
      if (action === 'added') {
        shows.addObject(changedShows);
      }
      else if (action === 'removed') {
        shows.removeObject(changedShows);
      }
      this.updateShows(shows);
    }
  }
});
