import { once } from '@ember/runloop';
import { mapBy } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['discover-show-list'],
  showSlugs:  mapBy('shows', 'slug'),

  init() {
    this._super(...arguments);
    this.setProperties({
      shows: this.shows || [],
      selectedShowSlugs: this.selectedShowSlugs || [],
      excludedShowSlugs: this.excludedShowSlugs || [],
    });
    this.updateShows();
  },

  didReceiveAttrs() {
    this.set('selectedShowSlugs', this.get('showSlugs').reject(item => {
      return this.excludedShowSlugs.includes(item);
    }));
    this.updateShows()

    this._super(...arguments);
  },

  updateShows() {
    once(() => {
      /* eslint-disable */
      this.sendAction('onShowsUpdated', this.excludedShowSlugs.slice());
      this.sendAction('onNoneSelected', this.selectedShowSlugs.length === 0);
      /* eslint-enable */
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
