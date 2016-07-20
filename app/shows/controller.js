import Ember from 'ember';

export default Ember.Controller.extend({
  filteredShows: Ember.computed("model.allShows", "searchText", function(){
    var query = this.get("searchText");
    var shows = this.store.peekAll('shows');
    if (query.length > 0){
      query = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); //remove any regex characters
      var regex = new RegExp(query, 'i'); //case insensitive
      let result = shows.filter(function(s) {
        return regex.test(s.get("title"));
      });
      return result;
    } else {
      return shows;
    }
  }),

  noResults: Ember.computed.equal("filteredShows.length",0),
  searchText: "",

  actions: {
    filterShows(val) {
      this.set("searchText", val);
    }
  }
});
