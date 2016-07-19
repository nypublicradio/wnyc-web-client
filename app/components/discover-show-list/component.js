import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  classNames:['discover-show-list'],
  shows: [],
  selectedShows: [],
                     // component I used wants the models

  excludedShows: [],

  didReceiveAttrs() {
    let excludedShowSlugs = this.get('excludedShowSlugs') || [];
    var excludedShows = this.get('excludedShows') || [];
    var selectedShows = this.get('selectedShows') || [];

    if (excludedShowSlugs) {
      // Now we'll find the matching objects in the discover topics,
      // and add them to the selectedTopics list
      this.get('shows').forEach(function(show) {
        if (excludedShowSlugs.contains(get(show, 'slug'))) {
          excludedShows.addObject(show);
        }
        else {
          selectedShows.addObject(show);
        }
      });
    }

    this.set('excludedShows', excludedShows);
    this.set('selectedShows', selectedShows);

    this._super(...arguments);
  },

  initializeShows: Ember.on('init', function() {
    Ember.run.once(() => {
      this.sendAction('onShowsUpdated', this.get('excludedShows').mapBy('slug'));
      this.sendAction('onNoneSelected', this.get('selectedShows').length === 0);
    });
  }),

  actions: {
    onMultiselectChangeEvent(selectedShows, changedShows, action) {
      let shows         = this.get('selectedShows');
      let excludedShows = this.get('excludedShows');
      if (action === 'added') {
        shows.addObject(changedShows);
        excludedShows.removeObject(changedShows);
      }
      else if (action === 'removed') {
        shows.removeObject(changedShows);
        excludedShows.addObject(changedShows);
      }

      this.sendAction('onShowsUpdated', excludedShows.mapBy('slug'));
      this.sendAction('onNoneSelected', selectedShows.length === 0);
    }
  }
});
