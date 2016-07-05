import DS from 'ember-data';
import Ember from 'ember';
import { serializeInlineDoc } from 'overhaul/lib/compat-hooks';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id /*, requestType */) {
    let attributes = {};
    if (payload instanceof Document) {
      let doc;
      if (Ember.testing) {
        doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(payload.querySelector('#ember-testing').cloneNode(true));
      } else {
        doc = payload.documentElement.cloneNode(true);
      }

      attributes.inlineDocument = serializeInlineDoc(doc);
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
