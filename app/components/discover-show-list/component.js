import Ember from 'ember';
import Component from 'ember-component';
import { mapBy } from 'ember-computed';
import { once } from 'ember-runloop';
import { on } from 'ember-evented';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/get';

export default Component.extend({
  classNames:['discover-show-list'],
  shows: [],
  showSlugs: mapBy('shows', 'slug'),
  selectedShowSlugs: [],
  excludedShowSlugs: [],
  metrics: service(),

  didReceiveAttrs() {
    set(this, 'selectedShowSlugs', get(this, 'showSlugs').reject(item => {
      return get(this, 'excludedShowSlugs').contains(item);
    }));

    this._super(...arguments);
  },

  initializeShows: on('init', function() {
    this.updateShows(get(this, 'excludedShowSlugs'), get(this, 'selectedShowSlugs'));
  }),

  updateShows(excludedShowSlugs, selectedShowSlugs) {
    once(() => {
      this.sendAction('onShowsUpdated', excludedShowSlugs.slice());
      this.sendAction('onNoneSelected', selectedShowSlugs.length === 0);
    });
  },

  actions: {
    onMultiselectChangeEvent(shows, value, action) {
      let excludedShowSlugs = get(this, 'excludedShowSlugs');
      let selectedShowSlugs = get(this, 'selectedShowSlugs');

      if (action === 'added') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Selected Show',
          label: value.title
        });
        selectedShowSlugs.addObject(value);
        excludedShowSlugs.removeObject(value);
      }
      else if (action === 'removed') {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Deselected Show',
          label: value.title
        });
        selectedShowSlugs.removeObject(value);
        excludedShowSlugs.addObject(value);
      }

      this.updateShows(excludedShowSlugs, selectedShowSlugs);
    }
  }
});
