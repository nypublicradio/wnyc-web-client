import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-show-list'],
  shows: [],
  showSlugs:     Ember.computed.mapBy('shows', 'slug'),
  selectedShowSlugs: [],
  excludedShowSlugs: [],

  didReceiveAttrs() {
    this.set('selectedShowSlugs', this.get('showSlugs').reject(item => {
      return this.get('excludedShowSlugs').contains(item);
    }));

    this._super(...arguments);
  },

  initializeShows: Ember.on('init', function() {
    this.updateShows(this.get('excludedShowSlugs'), this.get('selectedShowSlugs'));
  }),

  updateShows(excludedShowSlugs, selectedShowSlugs) {
    Ember.run.once(() => {
      this.sendAction('onShowsUpdated', excludedShowSlugs.slice());
      this.sendAction('onNoneSelected', selectedShowSlugs.length === 0);
    });
  },

  actions: {
    onMultiselectChangeEvent(shows, value, action) {
      let excludedShowSlugs = this.get('excludedShowSlugs');
      let selectedShowSlugs = this.get('selectedShowSlugs');

      if (action === 'added') {
        selectedShowSlugs.addObject(value);
        excludedShowSlugs.removeObject(value);
      }
      else if (action === 'removed') {
        selectedShowSlugs.removeObject(value);
        excludedShowSlugs.addObject(value);
      }

      this.updateShows(excludedShowSlugs, selectedShowSlugs);
    }
  }
});
