import DS from 'ember-data';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id /*, requestType */) {
    let attributes = {};
    if (payload instanceof Document) {
      attributes.inlineDocument = payload.documentElement.cloneNode(true);

      // By this point, ember has already booted a view into the Document, so
      // we need to clean it from the version we save as our data model, otherwise
      // we get problems from recursive ember views
      Array.from(attributes.inlineDocument.querySelectorAll('.ember-view'))
        .forEach(n => n.parentNode.removeChild(n));
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
