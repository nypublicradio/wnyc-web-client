import DS from 'ember-data';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id /*, requestType */) {
    let attributes = {};
    if (payload instanceof Document) {
      attributes.inlineDocument = payload.documentElement.cloneNode(true);
    } else {
      attributes.text = payload;
    }

    return {
      data: {
        type: 'django-page',
        id,
        attributes,
      }
    };
  }
});
