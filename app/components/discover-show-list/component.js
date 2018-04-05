import { once } from '@ember/runloop';
import { mapBy } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  metrics: service(),
  classNames:['discover-show-list'],
  showSlugs:     mapBy('shows', 'slug'),

  init() {
    this._super(...arguments);
    this.setProperties({
      shows: [],
      selectedShowSlugs: [],
      excludedShowSlugs: [],
    });
    this.updateShows(this.get('excludedShowSlugs'), this.get('selectedShowSlugs'));
  },

  didReceiveAttrs() {
    this.set('selectedShowSlugs', this.get('showSlugs').reject(item => {
      return this.get('excludedShowSlugs').includes(item);
    }));

    this._super(...arguments);
  },

  updateShows(excludedShowSlugs, selectedShowSlugs) {
    once(() => {
      this.onShowsUpdated(excludedShowSlugs.slice());
      this.onNoneSelected(selectedShowSlugs.length === 0);
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
