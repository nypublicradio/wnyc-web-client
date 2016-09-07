import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Controller.extend({
  store: service(),
  filteredShows: computed('model.allShows', 'searchText', function() {
    let searchText = get(this, 'searchText');
    let shows = get(this, 'model.allShows');
    let result = shows.toArray();
    if (searchText.length > 0){
      let query = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); //remove any regex characters
      let regex = new RegExp(query, 'i'); //case insensitive
      result = shows.filter(function(show) {
        return regex.test(show.get('title'));
      });
    }
    return result.sortBy('sortableTitle');
  }),
  noResults: computed.equal('filteredShows.length', 0),
  searchText: '',

  actions: {
    resetSearchFilter() {
      this.set("searchText", "");
    },
    filterShows(val) {
      this.set("searchText", val);
    }
  }
});
