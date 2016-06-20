import Ember from 'ember';
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload) {
    return {
      data: payload.results.map(result => {

        return {
          id: result.cmsPK,
          type: 'discover.stories',
          attributes: {
            title:              result.title,
            showTitle:          Ember.get(result,'show.show_title'),
            showUrl:            Ember.get(result,'show.show_url'),
            summary:            result.tease,
            estimatedDuration:  result.estimated_duration,
            date:               result.newsdate,
            audio:              result.audio,
            url:                result.url,
            cmsPK:              result.cmsPK
          }
        };
      })
    };
  }
});
