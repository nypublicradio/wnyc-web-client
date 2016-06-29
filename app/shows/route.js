import Route from 'ember-route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      allShows: this.store.findAll('shows'),
      featured: this.store.findRecord('bucket', 'wnyc-shows-featured').then(b => b.get('bucketItems.firstObject'))
    });
  },
  actions: {
    filterShows(val) {
      // running the filter
      // reset everything and show an animated spinner while we wait for the data
      this.controller.set("noResults", false);
      this.controller.set("isSearching", true);

      if (val.length > 0){
        var shows = this.store.peekAll('shows');

        var regex = new RegExp(val, 'i'); //case insensitive
        var filteredShows = shows.filter(function(s) {
          return regex.test(s.get("title"));
        });

        this.controller.set("isSearching", false);
        this.controller.set('model.allShows', filteredShows);

        if (filteredShows.get("length") === 0){
          this.controller.set("noResults", true);
        }

      } else {
        // search box is empty, get all the shows
        var allshows = this.store.peekAll('shows');
        this.controller.set("isSearching", false);
        this.controller.set('model.allShows', allshows);
      }
    }
  }
});
