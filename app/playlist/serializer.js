import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  normalizeFindRecordResponse(store, primaryModelClass, payload, id) {
    return {
      data: {
        type: 'playlist',
        id,
        attributes: {
          items: payload.results.map((result) => {
            let data = {};
            Object.keys(result).forEach(function(key) {
              data[key.camelize()] = result[key];
            });
            return data;
          })
        }
      }
    };
  }
});
