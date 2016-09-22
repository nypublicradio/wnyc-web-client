import Ember from 'ember';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Ember.Component.extend({
  metrics: service(),
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
      let show = get(this, 'shows').findBy('slug', value);
      let title = get(show, 'title');

      if (action === 'added') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Selected Show in Discover',
          label: title
        });

        selectedShowSlugs.addObject(value);
        excludedShowSlugs.removeObject(value);
      }
      else if (action === 'removed') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Deselected Show in Discover',
          label: title
        });

        selectedShowSlugs.removeObject(value);
        excludedShowSlugs.addObject(value);
      }

      this.updateShows(excludedShowSlugs, selectedShowSlugs);
    }
  }
});
