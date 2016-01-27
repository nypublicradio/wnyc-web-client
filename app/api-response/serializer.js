import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  normalizeResponse(store, type, payload, id) {
    return {
      data: {
        type: 'api-response',
        id,
        attributes: {
          teaseList: payload.results,
          totalCount: payload.count,
          contentType: 'story-list'
        },
      },
    }
  }
});

