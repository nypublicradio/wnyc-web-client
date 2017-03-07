import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute(key) { return key; },
  modelNameFromPayloadKey() { return 'bucket'; },
  normalizeResponse(store, klass, payload/*, id, requestType*/) {
    payload.data.id = payload.data.attributes.slug;
    return this._super(...arguments);
  }
});
