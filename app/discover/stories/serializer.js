import Ember from 'ember';
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute(key) { return key; },

  normalizeQueryResponse(store, primaryModelClass, payload) {
    return {
      data: payload.data.map(result => {
        return {
          id: result.id,
          type: 'discover.stories',
          attributes: {
            title:                  Ember.get(result,'attributes.title'),
            showTitle:              Ember.get(result,'attributes.headers.brand.title'),
            showUrl:                Ember.get(result,'attributes.headers.brand.url'),
            estimatedDuration:      Ember.get(result,'attributes.estimatedDuration'),
            audioDurationReadable:  Ember.get(result,'attributes.audioDurationReadable'),
            date:                   Ember.get(result,'attributes.dateLine'),
            summary:                Ember.get(result,'attributes.tease'),
            audio:                  Ember.get(result,'attributes.audio'),
            url:                    Ember.get(result,'attributes.url'),
            cmsPK:                  result.id
          }
        };
      })
    };
  }
});
