import Ember from 'ember';
import RSVP from 'rsvp';
import ENV from '../config/environment';
const {
  get
} = Ember;


export default Ember.Service.extend({
  // This is responsible for calling into tag_story_query and show_story_query and then
  // providing a list of story ids for make_playlist. These queries are wrapped up
  // in this service so we're not making empty Ember Data story objects, since the
  // results of this query are just {type: "Story", id: 12512512, attributes: {}}

  shows: [],
  topics: [],

  storiesFromShows(slugs) {
    let url = [ENV.wnycAPI, 'api/v3/show_story_query'].join("/");

    return new RSVP.Promise((resolve) => {
      return Ember.$.ajax({
        data: {
          shows: slugs.join(";")
        },
        method: "GET",
        url: url
      }).then((results) => {
        let data = get(results, 'data') || [];
        resolve(data.map(r => r.id));
      });
    });
  },

  storiesFromTopics(tags) {
    let url = [ENV.wnycAPI, 'api/v3/tag_story_query'].join("/");

    return new RSVP.Promise((resolve) => {
      return Ember.$.ajax({
        data: {
          tags: tags.join(";")
        },
        method: "GET",
        url: url
      }).then((results) => {
        let data = get(results, 'data') || [];
        resolve(data.map(r => r.id));
      });
    });
  }
});
