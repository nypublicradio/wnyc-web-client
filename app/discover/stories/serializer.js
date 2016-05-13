import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload) {
    return {
      data: payload.results.map(result => {
        let id = result.pk;
        delete result.id;
        return {
          id,
          type: 'discover.stories',
          attributes: result
        };
      })
    };
  }
});
