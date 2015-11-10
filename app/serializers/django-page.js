import DS from 'ember-data';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id /*, requestType */) {
    return {
      data: {
        type: 'django-page',
        id,
        attributes: {
          text: payload
        }
      }
    };
  }
});
