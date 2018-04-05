import { once } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { mapBy } from '@ember/object/computed';
import Component from '@ember/component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  metrics: service(),
  classNames:['discover-show-list'],
  shows: [],
  showSlugs:     mapBy('shows', 'slug'),
  selectedShowSlugs: [],
  excludedShowSlugs: [],

  didReceiveAttrs() {
    this.set('selectedShowSlugs', this.get('showSlugs').reject(item => {
      return this.get('excludedShowSlugs').includes(item);
    }));

    this._super(...arguments);
  },

  initializeShows: on('init', function() {
    this.updateShows(this.get('excludedShowSlugs'), this.get('selectedShowSlugs'));
  }),

  updateShows(excludedShowSlugs, selectedShowSlugs) {
    once(() => {
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
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'Discover',
          action: 'Selected Show in Discover',
          label: title
        });

        selectedShowSlugs.addObject(value);
        excludedShowSlugs.removeObject(value);
      }
      else if (action === 'removed') {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
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
